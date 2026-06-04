# 💜 hiafribaba - تطبيق مواعدة آمن ومشفر

تطبيق مواعدة متكامل مع نظام أدوار متعدد، محادثات مشفرة، مكالمات فيديو، محفظة رقمية، ونظام ثقة.

---

## 📱 الميزات الرئيسية

### 👥 نظام الأدوار
- **رجل** - يدفع اشتراك شهري + عملات للقاءات
- **امرأة** - تحدد خطط الأسعار وتستلم 85%
- **Active** - مثل الرجل (للغير ثنائي)
- **Passive** - مثل المرأة (للغير ثنائي)

### 💰 النظام المالي
- اشتراك شهري (50-100 درهم)
- اشتراك VIP (50-70 درهم) - فتح جميع الميزات
- خطط أسعار (100/200/300 درهم)
- عمولة التطبيق 15%
- محفظة رقمية مع شحن وسحب

### 🔒 الأمان والخصوصية
- تشفير نهاية للنهاية للمحادثات
- منع لقطات الشاشة
- صور المشاهدة لمرة واحدة
- توثيق اختياري (رقم الهاتف + الصورة)
- نظام نسبة الثقة (Trust Score)

### 🗺️ الميزات الأخرى
- خريطة تفاعلية للمستخدمين القريبين
- محادثات فورية مع مؤشر "يكتب..."
- مكالمات صوتية وفيديو (WebRTC)
- نظام لقاءات مع تأكيد البلوتوث
- إشعارات Push
- بحث متقدم مع فلترة

---

## 🛠️ التقنيات المستخدمة

| التقنية | الاستخدام |
|----------|-----------|
| React Native (Expo) | بناء التطبيق |
| TypeScript | typing آمن |
| React Navigation | التوجيه بين الشاشات |
| react-native-maps | الخريطة |
| expo-location | GPS |
| Socket.io | المحادثات الفورية |
| WebRTC | المكالمات |
| Node.js + Express | الخادم الخلفي |
| SQLite | قاعدة البيانات |
| JWT | المصادقة |

---

## 📂 هيكل المشروع

```

hiafribaba-dating-app/
├── App.tsx                 # الملف الرئيسي
├── src/
│   ├── screens/            # الشاشات
│   │   ├── auth/           # تسجيل الدخول / إنشاء حساب
│   │   ├── main/           # الرئيسية، البحث
│   │   ├── profile/        # الملف الشخصي
│   │   ├── settings/       # الإعدادات
│   │   ├── wallet/         # المحفظة
│   │   ├── map/            # الخريطة
│   │   ├── messages/       # الرسائل
│   │   └── chat/           # المحادثة
│   ├── components/         # مكونات مشتركة
│   ├── context/            # AppContext
│   ├── services/           # API، Socket، Location
│   ├── constants/          # الثوابت والإعدادات
│   └── types/              # أنواع TypeScript
├── backend/                # الخادم الخلفي
│   ├── server.js
│   └── package.json
└── package.json

```

---

## 🚀 تشغيل المشروع محلياً

### المتطلبات الأساسية
- Node.js (v18 أو أحدث)
- npm أو pnpm
- Expo CLI

### الخطوات

```bash
# 1. نسخ المشروع
git clone https://github.com/artista93/hiafribaba-dating-app.git
cd hiafribaba-dating-app

# 2. تثبيت dependencies
npm install

# 3. تشغيل الخادم الخلفي (في نافذة منفصلة)
cd backend
npm install
node server.js

# 4. تشغيل التطبيق (في النافذة الرئيسية)
npm run web
```

للتشغيل على الهاتف

```bash
npx expo start --tunnel
```

ثم امسح كود QR من تطبيق Expo Go.

---

📦 بناء APK للنشر

```bash
# تثبيت eas-cli
npm install -g eas-cli

# تسجيل الدخول
eas login

# بناء APK
eas build -p android --profile preview
```

---

🌐 نشر النسخة الويب على GitHub Pages

```bash
# 1. تثبيت gh-pages
npm install --save-dev gh-pages

# 2. إضافة إلى package.json
# "homepage": "https://artista93.github.io/hiafribaba-dating-app"
# "predeploy": "npx expo export --platform web",
# "deploy": "gh-pages -d dist"

# 3. النشر
npm run deploy
```

---

👥 فريق التطوير

· المطور الرئيسي: @artista93

---

📄 الترخيص

جميع الحقوق محفوظة © 2024 hiafribaba

---

📞 التواصل

للاستفسارات والدعم: إنشاء issue على GitHub

---

⭐ شكر خاص

شكر خاص لكل من ساهم في تطوير هذا المشروع.
