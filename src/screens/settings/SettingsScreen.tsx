import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../context/AppContext';
import { GPS_OFFSET_OPTIONS, STORAGE_KEYS } from '../../constants/config';

const { width } = Dimensions.get('window');

// شاشة الإشعارات
const NotificationsScreen = ({ onBack }: { onBack: () => void }) => {
  const { notificationSettings, updateNotificationSettings } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإشعارات</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>ذكرني عندما تستقبل رسالة جديدة</Text>
            <Switch
              value={notificationSettings.newMessage}
              onValueChange={(value) => updateNotificationSettings({ ...notificationSettings, newMessage: value })}
              trackColor={{ false: '#334155', true: '#bf953f' }}
              thumbColor={notificationSettings.newMessage ? '#f8fafc' : '#94a3b8'}
            />
          </View>
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>عرض نص المعاينة</Text>
            <Switch
              value={notificationSettings.showPreview}
              onValueChange={(value) => updateNotificationSettings({ ...notificationSettings, showPreview: value })}
              trackColor={{ false: '#334155', true: '#bf953f' }}
              thumbColor={notificationSettings.showPreview ? '#f8fafc' : '#94a3b8'}
            />
          </View>
          <Text style={styles.settingSub}>إظهار تفاصيل الرسالة في الإشعارات</Text>
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingRow}>
            <Text style={styles.settingText}>كتم الصوت لفترة</Text>
            <Switch
              value={notificationSettings.mute}
              onValueChange={(value) => updateNotificationSettings({ ...notificationSettings, mute: value })}
              trackColor={{ false: '#334155', true: '#bf953f' }}
              thumbColor={notificationSettings.mute ? '#f8fafc' : '#94a3b8'}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// شاشة الخصوصية
const PrivacyScreen = ({ onBack }: { onBack: () => void }) => {
  const { privacySettings, updatePrivacySettings } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ضبط الخصوصية</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الموقع</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingText}>انحياد الـ GPS</Text>
            <Text style={styles.settingSub}>ضبط موقعك بحيث يكون منحاذ عن الموقع الأصلي</Text>
            <View style={styles.gpsChipsContainer}>
              {GPS_OFFSET_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.gpsChip,
                    privacySettings.gpsOffset === option.value && styles.gpsChipActive,
                  ]}
                  onPress={() => updatePrivacySettings({ ...privacySettings, gpsOffset: option.value })}
                >
                  <Text style={[
                    styles.gpsChipText,
                    privacySettings.gpsOffset === option.value && styles.gpsChipTextActive,
                  ]}>
                    {option.distance}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>إخفاء من القريبين</Text>
              <Switch
                value={privacySettings.hideFromNearby}
                onValueChange={(value) => updatePrivacySettings({ ...privacySettings, hideFromNearby: value })}
                trackColor={{ false: '#334155', true: '#bf953f' }}
                thumbColor={privacySettings.hideFromNearby ? '#f8fafc' : '#94a3b8'}
              />
            </View>
            <Text style={styles.settingSub}>لا تخليلي اظهر بالقريب</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>خاصية ضبط الرسائل</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>الموثقون فقط يمكنهم مراسلتي</Text>
              <Switch
                value={privacySettings.verifiedOnlyChat}
                onValueChange={(value) => updatePrivacySettings({ ...privacySettings, verifiedOnlyChat: value })}
                trackColor={{ false: '#334155', true: '#bf953f' }}
                thumbColor={privacySettings.verifiedOnlyChat ? '#f8fafc' : '#94a3b8'}
              />
            </View>
          </View>
          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>إخفاء عمري</Text>
              <Switch
                value={privacySettings.hideAge}
                onValueChange={(value) => updatePrivacySettings({ ...privacySettings, hideAge: value })}
                trackColor={{ false: '#334155', true: '#bf953f' }}
                thumbColor={privacySettings.hideAge ? '#f8fafc' : '#94a3b8'}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الوضع الخفي</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>الوضع الخفي</Text>
              <Switch
                value={privacySettings.ghostMode}
                onValueChange={(value) => updatePrivacySettings({ ...privacySettings, ghostMode: value })}
                trackColor={{ false: '#334155', true: '#bf953f' }}
                thumbColor={privacySettings.ghostMode ? '#f8fafc' : '#94a3b8'}
              />
            </View>
            <Text style={styles.settingSub}>عرض الملفات الشخصية للأشخاص الآخرين دون أن يتم اكتشافك</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// شاشة الأمان
const SecurityScreen = ({ onBack }: { onBack: () => void }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [hasPasscode, setHasPasscode] = useState(false);

  useEffect(() => { checkPasscode(); }, []);

  const checkPasscode = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.PASSCODE);
      setHasPasscode(!!saved);
    } catch (error) { console.error(error); }
  };

  const savePasscode = async () => {
    if (passcode.length !== 4) { Alert.alert('خطأ', 'الرجاء إدخال 4 أرقام'); return; }
    if (passcode !== confirmPasscode) { Alert.alert('خطأ', 'رمز المرور غير متطابق'); return; }
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PASSCODE, passcode);
      setHasPasscode(true);
      setShowPasswordModal(false);
      setPasscode('');
      setConfirmPasscode('');
      Alert.alert('نجاح', 'تم تعيين رمز المرور بنجاح');
    } catch (error) { Alert.alert('خطأ', 'حدث خطأ في حفظ رمز المرور'); }
  };

  const removePasscode = async () => {
    Alert.alert('تأكيد', 'هل أنت متأكد من إزالة رمز المرور؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'تأكيد', onPress: async () => { await AsyncStorage.removeItem(STORAGE_KEYS.PASSCODE); setHasPasscode(false); Alert.alert('نجاح', 'تم إزالة رمز المرور'); } },
    ]);
  };

  const clearChatHistory = () => {
    Alert.alert('تأكيد', 'هل أنت متأكد من حذف سجل المحادثة؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'تأكيد', onPress: () => Alert.alert('نجاح', 'تم حذف سجل المحادثة') },
    ]);
  };

  const deleteAccount = () => {
    Alert.alert('تأكيد حذف الحساب', 'هذا الإجراء لا يمكن التراجع عنه', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', onPress: () => Alert.alert('نجاح', 'تم حذف الحساب'), style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الأمان</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.settingItem} onPress={() => setShowPasswordModal(true)}>
          <Text style={styles.settingText}>رمز المرور</Text>
          <Text style={styles.settingSub}>{hasPasscode ? 'تم تعيين رمز مرور ✓' : 'لم يتم التعيين'}</Text>
        </TouchableOpacity>
        {hasPasscode && (
          <TouchableOpacity style={styles.settingItem} onPress={removePasscode}>
            <Text style={[styles.settingText, { color: '#f87171' }]}>إزالة رمز المرور</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.settingItem} onPress={clearChatHistory}>
          <Text style={styles.settingText}>حذف سجل المحادثة</Text>
          <Text style={styles.settingSub}>انقر لحذف سجل المحادثة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={deleteAccount}>
          <Text style={[styles.settingText, styles.dangerText]}>حذف حسابي</Text>
          <Text style={[styles.settingSub, styles.dangerText]}>هذا الإجراء لا يمكن التراجع عنه</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showPasswordModal} transparent animationType="slide" onRequestClose={() => setShowPasswordModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.passwordModalContainer}>
            <Text style={styles.passwordModalTitle}>تعيين رمز المرور</Text>
            <Text style={styles.passwordModalSub}>أدخل 4 أرقام</Text>
            <TextInput style={styles.passwordInput} keyboardType="numeric" maxLength={4} secureTextEntry value={passcode} onChangeText={setPasscode} placeholder="****" placeholderTextColor="#64748b" />
            <TextInput style={styles.passwordInput} keyboardType="numeric" maxLength={4} secureTextEntry value={confirmPasscode} onChangeText={setConfirmPasscode} placeholder="تأكيد رمز المرور" placeholderTextColor="#64748b" />
            <View style={styles.passwordModalButtons}>
              <TouchableOpacity style={[styles.passwordModalButton, styles.passwordModalCancel]} onPress={() => setShowPasswordModal(false)}><Text style={styles.passwordModalButtonText}>إلغاء</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.passwordModalButton, styles.passwordModalSave]} onPress={savePasscode}><Text style={[styles.passwordModalButtonText, { color: '#0f172a' }]}>حفظ</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// شاشة الإعدادات الرئيسية
const SettingsMainScreen = ({ onBack }: { onBack: () => void }) => {
  const [currentScreen, setCurrentScreen] = useState<'main' | 'notifications' | 'privacy' | 'security'>('main');

  if (currentScreen === 'notifications') return <NotificationsScreen onBack={() => setCurrentScreen('main')} />;
  if (currentScreen === 'privacy') return <PrivacyScreen onBack={() => setCurrentScreen('main')} />;
  if (currentScreen === 'security') return <SecurityScreen onBack={() => setCurrentScreen('main')} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>الإعدادات</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView style={styles.content}>
        <TouchableOpacity style={styles.settingsItem} onPress={() => setCurrentScreen('notifications')}>
          <Text style={styles.settingsItemText}>🔔 الإشعارات</Text>
          <Text style={styles.settingsItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={() => setCurrentScreen('privacy')}>
          <Text style={styles.settingsItemText}>🔒 الخصوصية</Text>
          <Text style={styles.settingsItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={() => setCurrentScreen('security')}>
          <Text style={styles.settingsItemText}>🛡️ الأمان</Text>
          <Text style={styles.settingsItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsItemText}>🌙 المظهر (الوضع الداكن)</Text>
          <Text style={styles.settingsItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsItemText}>🌐 اللغة</Text>
          <Text style={styles.settingsItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsItemText}>❓ المساعدة والدعم</Text>
          <Text style={styles.settingsItemArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsItemText}>ℹ️ حول التطبيق</Text>
          <Text style={styles.settingsItemArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  backText: { fontSize: 24, color: '#fbbf24' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#f8fafc' },
  content: { flex: 1 },
  settingsItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  settingsItemText: { fontSize: 16, color: '#f8fafc' },
  settingsItemArrow: { fontSize: 20, color: '#64748b' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#bf953f', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  settingItem: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  settingText: { fontSize: 15, color: '#f8fafc', marginBottom: 4 },
  settingSub: { fontSize: 12, color: '#64748b' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gpsChipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  gpsChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(30, 41, 59, 0.8)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  gpsChipActive: { backgroundColor: '#bf953f', borderColor: '#bf953f' },
  gpsChipText: { fontSize: 13, color: '#94a3b8' },
  gpsChipTextActive: { color: '#0f172a', fontWeight: 'bold' },
  dangerItem: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
  dangerText: { color: '#f87171' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  passwordModalContainer: { width: width - 60, backgroundColor: '#1e293b', borderRadius: 20, padding: 20, alignItems: 'center' },
  passwordModalTitle: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  passwordModalSub: { fontSize: 14, color: '#94a3b8', marginBottom: 20 },
  passwordInput: { width: '100%', backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: 12, padding: 12, color: '#f8fafc', fontSize: 18, textAlign: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(191,149,63,0.3)' },
  passwordModalButtons: { flexDirection: 'row', gap: 12, marginTop: 12 },
  passwordModalButton: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  passwordModalCancel: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  passwordModalSave: { backgroundColor: '#bf953f' },
  passwordModalButtonText: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
});

export default SettingsMainScreen;
