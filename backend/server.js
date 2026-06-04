const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database
const db = new sqlite3.Database('./datingapp.db');

// إنشاء الجداول
db.serialize(() => {
  // جدول المستخدمين
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT,
      phone TEXT UNIQUE,
      email TEXT,
      password TEXT,
      age INTEGER,
      location TEXT,
      userType TEXT,
      isVerified INTEGER DEFAULT 0,
      avatar TEXT,
      balance INTEGER DEFAULT 0,
      earnings INTEGER DEFAULT 0,
      isVIP INTEGER DEFAULT 0,
      vipExpiresAt INTEGER,
      createdAt INTEGER
    )
  `);

  // جدول المحفظة
  db.run(`
    CREATE TABLE IF NOT EXISTS wallet (
      id TEXT PRIMARY KEY,
      userId TEXT,
      balance INTEGER DEFAULT 0,
      earnings INTEGER DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // جدول المعاملات
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      userId TEXT,
      type TEXT,
      amount INTEGER,
      fee INTEGER,
      netAmount INTEGER,
      status TEXT,
      paymentMethod TEXT,
      reference TEXT,
      description TEXT,
      createdAt INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // جدول البطاقات المحفوظة
  db.run(`
    CREATE TABLE IF NOT EXISTS saved_cards (
      id TEXT PRIMARY KEY,
      userId TEXT,
      cardLast4 TEXT,
      cardBrand TEXT,
      cardToken TEXT,
      createdAt INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // جدول رموز OTP
  db.run(`
    CREATE TABLE IF NOT EXISTS otp_codes (
      id TEXT PRIMARY KEY,
      userId TEXT,
      code TEXT,
      type TEXT,
      expiresAt INTEGER,
      isUsed INTEGER DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

// إعداد البريد الإلكتروني للإشعارات
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// دالة توليد رمز OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// دالة إرسال OTP عبر البريد
const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'رمز تأكيد العملية - hiafribaba',
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif;">
          <h2>🔐 رمز التأكيد الخاص بك</h2>
          <p>استخدم الرمز التالي لتأكيد عملية الدفع:</p>
          <h1 style="color: #bf953f; font-size: 32px;">${otp}</h1>
          <p>هذا الرمز صالح لمدة 5 دقائق.</p>
          <p>إذا لم تطلب هذا، يرجى تجاهل هذه الرسالة.</p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

// دالة إرسال OTP عبر SMS (محاكاة)
const sendOTPSMS = async (phone, otp) => {
  // هنا سيتم ربط API حقيقي للإرسال
  console.log(`SMS to ${phone}: Your OTP is ${otp}`);
  return true;
};

// ============= API: المحفظة =============

// الحصول على رصيد المحفظة
app.get('/api/wallet/:userId', async (req, res) => {
  const { userId } = req.params;
  
  db.get('SELECT balance, earnings FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, balance: user?.balance || 0, earnings: user?.earnings || 0 });
  });
});

// الحصول على معاملات المستخدم
app.get('/api/wallet/transactions/:userId', async (req, res) => {
  const { userId } = req.params;
  
  db.all('SELECT * FROM transactions WHERE userId = ? ORDER BY createdAt DESC LIMIT 50', [userId], (err, transactions) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, transactions });
  });
});

// طلب شحن الرصيد
app.post('/api/wallet/topup/request', async (req, res) => {
  const { userId, amount, paymentMethod } = req.body;
  
  if (amount < 50) {
    return res.status(400).json({ success: false, message: 'الحد الأدنى للشحن هو 50 درهم' });
  }
  
  const fee = amount * 0.05;
  const netAmount = amount - fee;
  
  // توليد رمز OTP
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 دقائق
  
  db.run(
    `INSERT INTO otp_codes (id, userId, code, type, expiresAt) VALUES (?, ?, ?, ?, ?)`,
    [Date.now().toString(), userId, otp, 'topup', expiresAt],
    async (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error creating OTP' });
      }
      
      // إرسال OTP
      db.get('SELECT email, phone FROM users WHERE id = ?', [userId], async (err, user) => {
        if (user?.email) {
          await sendOTPEmail(user.email, otp);
        }
        await sendOTPSMS(user?.phone, otp);
        
        res.json({ 
          success: true, 
          message: 'تم إرسال رمز التأكيد', 
          amount, 
          fee, 
          netAmount,
          paymentMethod 
        });
      });
    }
  );
});

// تأكيد الشحن
app.post('/api/wallet/topup/confirm', async (req, res) => {
  const { userId, amount, paymentMethod, otp, cardToken } = req.body;
  
  // التحقق من OTP
  db.get('SELECT * FROM otp_codes WHERE userId = ? AND code = ? AND type = ? AND isUsed = 0 AND expiresAt > ?', 
    [userId, otp, 'topup', Date.now()], 
    async (err, otpRecord) => {
      if (err || !otpRecord) {
        return res.status(400).json({ success: false, message: 'رمز التأكيد غير صحيح أو منتهي الصلاحية' });
      }
      
      // تحديث حالة OTP
      db.run('UPDATE otp_codes SET isUsed = 1 WHERE id = ?', [otpRecord.id]);
      
      const fee = amount * 0.05;
      const netAmount = amount - fee;
      
      // تحديث رصيد المستخدم
      db.get('SELECT balance FROM users WHERE id = ?', [userId], (err, user) => {
        const newBalance = (user?.balance || 0) + netAmount;
        
        db.run('UPDATE users SET balance = ? WHERE id = ?', [newBalance, userId]);
        
        // تسجيل المعاملة
        db.run(
          `INSERT INTO transactions (id, userId, type, amount, fee, netAmount, status, paymentMethod, description, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            Date.now().toString(),
            userId,
            'topup',
            amount,
            fee,
            netAmount,
            'completed',
            paymentMethod,
            `شحن رصيد بقيمة ${amount} درهم`,
            Date.now(),
          ]
        );
        
        res.json({ 
          success: true, 
          message: `تم شحن ${netAmount} عملة بنجاح`,
          newBalance 
        });
      });
    }
  );
});

// طلب سحب أرباح
app.post('/api/wallet/withdraw/request', async (req, res) => {
  const { userId, amount, withdrawalMethod } = req.body;
  
  if (amount < 100) {
    return res.status(400).json({ success: false, message: 'الحد الأدنى للسحب هو 100 درهم' });
  }
  
  db.get('SELECT earnings FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(500).json({ success: false, message: 'User not found' });
    }
    
    if (amount > user.earnings) {
      return res.status(400).json({ success: false, message: 'الأرباح المتاحة لا تكفي' });
    }
    
    const fee = amount * 0.05;
    const netAmount = amount - fee;
    
    // توليد OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    
    db.run(
      `INSERT INTO otp_codes (id, userId, code, type, expiresAt) VALUES (?, ?, ?, ?, ?)`,
      [Date.now().toString(), userId, otp, 'withdraw', expiresAt],
      async (err) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error creating OTP' });
        }
        
        db.get('SELECT email, phone FROM users WHERE id = ?', [userId], async (err, user) => {
          if (user?.email) {
            await sendOTPEmail(user.email, otp);
          }
          await sendOTPSMS(user?.phone, otp);
          
          res.json({ 
            success: true, 
            message: 'تم إرسال رمز التأكيد', 
            amount, 
            fee, 
            netAmount,
            withdrawalMethod 
          });
        });
      }
    );
  });
});

// تأكيد السحب
app.post('/api/wallet/withdraw/confirm', async (req, res) => {
  const { userId, amount, withdrawalMethod, otp } = req.body;
  
  db.get('SELECT * FROM otp_codes WHERE userId = ? AND code = ? AND type = ? AND isUsed = 0 AND expiresAt > ?', 
    [userId, otp, 'withdraw', Date.now()], 
    async (err, otpRecord) => {
      if (err || !otpRecord) {
        return res.status(400).json({ success: false, message: 'رمز التأكيد غير صحيح أو منتهي الصلاحية' });
      }
      
      db.run('UPDATE otp_codes SET isUsed = 1 WHERE id = ?', [otpRecord.id]);
      
      const fee = amount * 0.05;
      const netAmount = amount - fee;
      
      db.get('SELECT earnings FROM users WHERE id = ?', [userId], (err, user) => {
        const newEarnings = (user?.earnings || 0) - amount;
        
        db.run('UPDATE users SET earnings = ? WHERE id = ?', [newEarnings, userId]);
        
        db.run(
          `INSERT INTO transactions (id, userId, type, amount, fee, netAmount, status, paymentMethod, description, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            Date.now().toString(),
            userId,
            'withdraw',
            amount,
            fee,
            netAmount,
            'pending',
            withdrawalMethod,
            `طلب سحب أرباح بقيمة ${amount} درهم`,
            Date.now(),
          ]
        );
        
        res.json({ 
          success: true, 
          message: `تم تقديم طلب السحب بنجاح`,
          newEarnings 
        });
      });
    }
  );
});

// حفظ بطاقة دفع
app.post('/api/wallet/card/save', async (req, res) => {
  const { userId, cardNumber, cardHolder, expiryDate, cvv } = req.body;
  
  const last4 = cardNumber.slice(-4);
  const cardBrand = cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';
  const cardToken = crypto.randomBytes(32).toString('hex');
  
  db.run(
    `INSERT INTO saved_cards (id, userId, cardLast4, cardBrand, cardToken, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [Date.now().toString(), userId, last4, cardBrand, cardToken, Date.now()],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error saving card' });
      }
      res.json({ success: true, message: 'تم حفظ البطاقة بنجاح' });
    }
  );
});

// الحصول على البطاقات المحفوظة
app.get('/api/wallet/cards/:userId', async (req, res) => {
  const { userId } = req.params;
  
  db.all('SELECT id, cardLast4, cardBrand FROM saved_cards WHERE userId = ?', [userId], (err, cards) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, cards });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
