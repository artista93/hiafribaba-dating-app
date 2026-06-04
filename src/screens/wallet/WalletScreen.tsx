import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import BottomNav from '../../components/main/BottomNav';

const WalletScreen: React.FC = () => {
  const { 
    user, 
    userType, 
    wallet, 
    topUpRequest, 
    topUpConfirm, 
    withdrawRequest, 
    withdrawConfirm,
    loadWallet,
    loadTransactions 
  } = useApp();
  
  const [amount, setAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'wallet' | 'cash'>('card');
  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState<'bank' | 'wallet'>('bank');
  const [loading, setLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [pendingAmount, setPendingAmount] = useState(0);
  const [pendingData, setPendingData] = useState<any>(null);

  const isMale = userType === 'male' || userType === 'active';
  const isFemale = userType === 'female' || userType === 'passive';
  const quickAmounts = [100, 200, 500, 1000];

  // تحديث البيانات عند تحميل الشاشة
  useEffect(() => {
    loadWallet();
    loadTransactions();
  }, []);

  const handleTopUp = async () => {
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('خطأ', 'الرجاء إدخال مبلغ صحيح');
      return;
    }
    if (amountNum < 50) {
      Alert.alert('خطأ', 'الحد الأدنى للشحن هو 50 درهم');
      return;
    }
    
    setPendingAmount(amountNum);
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    setLoading(true);
    try {
      const result = await topUpRequest(pendingAmount, selectedPaymentMethod);
      setPendingData(result);
      setShowPaymentModal(false);
      setShowOTPModal(true);
      Alert.alert('تم الإرسال', 'تم إرسال رمز التأكيد إلى بريدك الإلكتروني ورقم هاتفك');
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (otpCode.length < 4) {
      Alert.alert('خطأ', 'الرجاء إدخال رمز التأكيد الصحيح');
      return;
    }
    
    setLoading(true);
    try {
      const result = await topUpConfirm(pendingAmount, selectedPaymentMethod, otpCode);
      Alert.alert('نجاح', result.message);
      setShowOTPModal(false);
      setOtpCode('');
      setAmount('');
      setPendingAmount(0);
      await loadWallet();
      await loadTransactions();
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('خطأ', 'الرجاء إدخال مبلغ صحيح');
      return;
    }
    if (amountNum < 100) {
      Alert.alert('خطأ', 'الحد الأدنى للسحب هو 100 درهم');
      return;
    }
    if (amountNum > wallet.earnings) {
      Alert.alert('خطأ', 'الأرباح المتاحة لا تكفي');
      return;
    }
    
    setPendingAmount(amountNum);
    setShowWithdrawModal(true);
  };

  const processWithdraw = async () => {
    setLoading(true);
    try {
      const result = await withdrawRequest(pendingAmount, selectedWithdrawMethod);
      setPendingData(result);
      setShowWithdrawModal(false);
      setShowOTPModal(true);
      Alert.alert('تم الإرسال', 'تم إرسال رمز التأكيد إلى بريدك الإلكتروني ورقم هاتفك');
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyWithdrawOTP = async () => {
    if (otpCode.length < 4) {
      Alert.alert('خطأ', 'الرجاء إدخال رمز التأكيد الصحيح');
      return;
    }
    
    setLoading(true);
    try {
      const result = await withdrawConfirm(pendingAmount, selectedWithdrawMethod, otpCode);
      Alert.alert('نجاح', result.message);
      setShowOTPModal(false);
      setOtpCode('');
      setAmount('');
      setPendingAmount(0);
      await loadWallet();
      await loadTransactions();
    } catch (error: any) {
      Alert.alert('خطأ', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string, amount: number) => {
    if (amount > 0) return '💰';
    switch (type) {
      case 'plan_purchase': return '🎁';
      case 'call_credit': return '📞';
      default: return '💸';
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? '#10b981' : '#ef4444';
  };

  const PaymentMethodButton = ({ method, label, icon }: { method: 'card' | 'wallet' | 'cash'; label: string; icon: string }) => (
    <TouchableOpacity
      style={[styles.paymentMethod, selectedPaymentMethod === method && styles.paymentMethodActive]}
      onPress={() => setSelectedPaymentMethod(method)}
    >
      <Text style={styles.paymentMethodIcon}>{icon}</Text>
      <Text style={[styles.paymentMethodText, selectedPaymentMethod === method && styles.paymentMethodTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const WithdrawMethodButton = ({ method, label, icon }: { method: 'bank' | 'wallet'; label: string; icon: string }) => (
    <TouchableOpacity
      style={[styles.paymentMethod, selectedWithdrawMethod === method && styles.paymentMethodActive]}
      onPress={() => setSelectedWithdrawMethod(method)}
    >
      <Text style={styles.paymentMethodIcon}>{icon}</Text>
      <Text style={[styles.paymentMethodText, selectedWithdrawMethod === method && styles.paymentMethodTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>💰 محفظتي</Text>
        </View>

        {/* Balance Card */}
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>
            {isMale ? 'الرصيد المتاح' : 'الأرباح القابلة للسحب'}
          </Text>
          <Text style={styles.balanceAmount}>
            {isMale ? wallet.balance.toFixed(0) : wallet.earnings.toFixed(0)}
          </Text>
          <Text style={styles.balanceCurrency}>
            {isMale ? 'عملة ذهبية' : 'درهم مغربي'}
          </Text>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isMale ? '🪙 شحن الرصيد' : '🏦 سحب الأرباح'}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {isMale ? 'الحد الأدنى 50 درهم • رسوم 5%' : 'الحد الأدنى 100 درهم • رسوم 5%'}
          </Text>
          
          {/* Quick Amounts */}
          <View style={styles.quickAmounts}>
            {quickAmounts.map((amt) => (
              <TouchableOpacity
                key={amt}
                style={[styles.quickAmount, parseInt(amount) === amt && styles.quickAmountActive]}
                onPress={() => setAmount(amt.toString())}
              >
                <Text style={[styles.quickAmountText, parseInt(amount) === amt && styles.quickAmountTextActive]}>
                  {amt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Amount Input */}
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="أدخل المبلغ"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            <Text style={styles.amountCurrency}>{isMale ? 'عملة' : 'درهم'}</Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={isMale ? handleTopUp : handleWithdraw}
          >
            <LinearGradient
              colors={['#bf953f', '#b38728']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.actionGradient}
            >
              <Text style={styles.actionButtonText}>
                {isMale ? 'شحن الآن' : 'سحب الأرباح'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Transactions History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 آخر المعاملات</Text>
          
          {wallet.transactions.length === 0 ? (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyText}>لا توجد معاملات بعد</Text>
            </View>
          ) : (
            wallet.transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <Text>{getTransactionIcon(transaction.type, transaction.amount)}</Text>
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDesc}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>
                    {new Date(transaction.createdAt).toLocaleDateString('ar')}
                  </Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={[styles.transactionAmountText, { color: getTransactionColor(transaction.amount) }]}>
                    {transaction.amount > 0 ? `+${transaction.netAmount || transaction.amount}` : transaction.amount}
                  </Text>
                  <Text style={styles.transactionCurrency}>
                    {transaction.type === 'withdraw' ? 'درهم' : 'عملة'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Fees Info */}
        <View style={styles.feesInfo}>
          <Text style={styles.feesTitle}>💰 معلومات العمولات</Text>
          <Text style={styles.feesText}>• رسوم الشحن: 5% من قيمة المبلغ</Text>
          <Text style={styles.feesText}>• رسوم السحب: 5% من قيمة المبلغ</Text>
          <Text style={styles.feesText}>• الحد الأدنى للشحن: 50 درهم</Text>
          <Text style={styles.feesText}>• الحد الأدنى للسحب: 100 درهم</Text>
          <Text style={styles.feesText}>• العمولة على خطط الأسعار: 15%</Text>
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر طريقة الدفع</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentMethods}>
              <PaymentMethodButton method="card" label="بطاقة بنكية" icon="💳" />
              <PaymentMethodButton method="wallet" label="محفظة إلكترونية" icon="📱" />
              <PaymentMethodButton method="cash" label="دفع نقدي" icon="💵" />
            </View>
            
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentAmount}>المبلغ: {pendingAmount} درهم</Text>
              <Text style={styles.paymentFee}>الرسوم (5%): {(pendingAmount * 0.05).toFixed(2)} درهم</Text>
              <Text style={styles.paymentTotal}>الإجمالي: {pendingAmount} درهم</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={processPayment}
              disabled={loading}
            >
              <LinearGradient colors={['#bf953f', '#b38728']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalButtonGradient}>
                <Text style={styles.modalButtonText}>
                  {loading ? 'جاري المعالجة...' : 'تأكيد الدفع'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Withdraw Method Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر طريقة السحب</Text>
              <TouchableOpacity onPress={() => setShowWithdrawModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.paymentMethods}>
              <WithdrawMethodButton method="bank" label="حساب بنكي" icon="🏦" />
              <WithdrawMethodButton method="wallet" label="محفظة إلكترونية" icon="📱" />
            </View>
            
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentAmount}>المبلغ: {pendingAmount} درهم</Text>
              <Text style={styles.paymentFee}>الرسوم (5%): {(pendingAmount * 0.05).toFixed(2)} درهم</Text>
              <Text style={styles.paymentTotal}>الصافي المستلم: {(pendingAmount - (pendingAmount * 0.05)).toFixed(2)} درهم</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={processWithdraw}
              disabled={loading}
            >
              <LinearGradient colors={['#bf953f', '#b38728']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.modalButtonGradient}>
                <Text style={styles.modalButtonText}>
                  {loading ? 'جاري المعالجة...' : 'تأكيد السحب'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOTPModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowOTPModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.otpContainer}>
            <Text style={styles.otpTitle}>🔐 تأكيد العملية</Text>
            <Text style={styles.otpSubtitle}>تم إرسال رمز التأكيد إلى بريدك الإلكتروني ورقم هاتفك</Text>
            
            <TextInput
              style={styles.otpInput}
              placeholder="أدخل الرمز المكون من 6 أرقام"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              maxLength={6}
              value={otpCode}
              onChangeText={setOtpCode}
            />
            
            <TouchableOpacity
              style={styles.otpButton}
              onPress={isMale ? verifyOTP : verifyWithdrawOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text style={styles.otpButtonText}>تأكيد</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#bf953f',
  },
  balanceCurrency: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  quickAmount: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  quickAmountActive: {
    backgroundColor: '#bf953f',
    borderColor: '#bf953f',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  quickAmountTextActive: {
    color: '#0f172a',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 16,
  },
  amountInput: {
    flex: 1,
    padding: 14,
    color: '#f8fafc',
    fontSize: 16,
    textAlign: 'center',
  },
  amountCurrency: {
    paddingHorizontal: 12,
    color: '#64748b',
    fontSize: 14,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    color: '#f8fafc',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 10,
    color: '#64748b',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionAmountText: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionCurrency: {
    fontSize: 10,
    color: '#64748b',
  },
  emptyTransactions: {
    backgroundColor: 'rgba(30, 41, 59, 0.3)',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
  },
  feesInfo: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(191, 149, 63, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(191, 149, 63, 0.2)',
  },
  feesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#bf953f',
    marginBottom: 8,
  },
  feesText: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 4,
  },
  bottomSpacer: {
    height: 70,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  modalClose: {
    fontSize: 20,
    color: '#94a3b8',
  },
  paymentMethods: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  paymentMethod: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  paymentMethodActive: {
    backgroundColor: '#bf953f',
    borderColor: '#bf953f',
  },
  paymentMethodIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  paymentMethodTextActive: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
  paymentDetails: {
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  paymentAmount: {
    fontSize: 14,
    color: '#f8fafc',
    marginBottom: 4,
  },
  paymentFee: {
    fontSize: 12,
    color: '#f87171',
    marginBottom: 4,
  },
  paymentTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#bf953f',
  },
  modalButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  otpContainer: {
    width: '85%',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpInput: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    padding: 12,
    color: '#f8fafc',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(191,149,63,0.3)',
  },
  otpButton: {
    width: '100%',
    backgroundColor: '#bf953f',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  otpButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WalletScreen;
