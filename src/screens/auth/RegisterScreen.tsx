import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';

type UserRole = 'male' | 'female' | 'nonbinary';
type SubRole = 'active' | 'passive' | null;

const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useApp();
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [subRole, setSubRole] = useState<SubRole>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
  });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role !== 'nonbinary') {
      setStep(2);
    }
  };

  const handleSubRoleSelect = (role: 'active' | 'passive') => {
    setSubRole(role);
    setStep(2);
  };

  const handleInfoSubmit = () => {
    if (!formData.name.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال الاسم');
      return;
    }
    if (!formData.age.trim() || parseInt(formData.age) < 18) {
      Alert.alert('خطأ', 'العمر يجب أن يكون 18 سنة أو أكثر');
      return;
    }
    if (!formData.phone.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال رقم الهاتف');
      return;
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('خطأ', 'كلمة المرور غير متطابقة');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('خطأ', 'الرجاء اختيار المدينة');
      return;
    }

    setStep(3);
  };

  const handleComplete = () => {
    setLoading(true);
    let finalRole: 'male' | 'female' | 'active' | 'passive' = 'male';
    if (selectedRole === 'male') finalRole = 'male';
    else if (selectedRole === 'female') finalRole = 'female';
    else if (subRole === 'active') finalRole = 'active';
    else if (subRole === 'passive') finalRole = 'passive';

    setTimeout(() => {
      login(formData.phone, formData.password, finalRole);
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
        </View>
        <Text style={styles.progressText}>الخطوة {step} من 3</Text>
      </View>

      {step > 1 && (
        <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
          <Text style={styles.backButtonText}>← الرجوع</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>اختر جنسك</Text>
            <View style={styles.rolesContainer}>
              <TouchableOpacity style={styles.roleCard} onPress={() => handleRoleSelect('male')}>
                <Text style={styles.roleIcon}>♂️</Text>
                <Text style={styles.roleTitle}>رجل</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.roleCard} onPress={() => handleRoleSelect('female')}>
                <Text style={styles.roleIcon}>♀️</Text>
                <Text style={styles.roleTitle}>امرأة</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.roleCard} onPress={() => handleRoleSelect('nonbinary')}>
                <Text style={styles.roleIcon}>⚧️</Text>
                <Text style={styles.roleTitle}>غير ثنائي</Text>
              </TouchableOpacity>
            </View>

            {selectedRole === 'nonbinary' && (
              <View style={styles.subRolesContainer}>
                <Text style={styles.subRolesTitle}>اختر نوع الحساب:</Text>
                <View style={styles.subRolesRow}>
                  <TouchableOpacity style={styles.subRoleCard} onPress={() => handleSubRoleSelect('active')}>
                    <Text style={styles.subRoleIcon}>⚡</Text>
                    <Text style={styles.subRoleTitle}>Active</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.subRoleCard} onPress={() => handleSubRoleSelect('passive')}>
                    <Text style={styles.subRoleIcon}>🌸</Text>
                    <Text style={styles.subRoleTitle}>Passive</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>المعلومات الشخصية</Text>
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الاسم المستعار</Text>
                <TextInput
                  style={styles.input}
                  placeholder="أدخل اسمك"
                  placeholderTextColor="#64748b"
                  value={formData.name}
                  onChangeText={(text) => setFormData({...formData, name: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>العمر</Text>
                <TextInput
                  style={styles.input}
                  placeholder="18+"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={formData.age}
                  onChangeText={(text) => setFormData({...formData, age: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>المدينة</Text>
                <TextInput
                  style={styles.input}
                  placeholder="الدار البيضاء، الرباط، مراكش..."
                  placeholderTextColor="#64748b"
                  value={formData.location}
                  onChangeText={(text) => setFormData({...formData, location: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>رقم الهاتف</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0612345678"
                  placeholderTextColor="#64748b"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({...formData, phone: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>كلمة المرور</Text>
                <TextInput
                  style={styles.input}
                  placeholder="********"
                  placeholderTextColor="#64748b"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => setFormData({...formData, password: text})}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>تأكيد كلمة المرور</Text>
                <TextInput
                  style={styles.input}
                  placeholder="********"
                  placeholderTextColor="#64748b"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={handleInfoSubmit}>
              <Text style={styles.nextButtonText}>التالي</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>تأكيد المعلومات</Text>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>الجنس:</Text>
                <Text style={styles.summaryValue}>
                  {selectedRole === 'male' ? 'رجل' : selectedRole === 'female' ? 'امرأة' : subRole === 'active' ? 'Active' : 'Passive'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>الاسم:</Text>
                <Text style={styles.summaryValue}>{formData.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>العمر:</Text>
                <Text style={styles.summaryValue}>{formData.age} سنة</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>المدينة:</Text>
                <Text style={styles.summaryValue}>{formData.location}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>رقم الهاتف:</Text>
                <Text style={styles.summaryValue}>{formData.phone}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete} disabled={loading}>
              <Text style={styles.completeButtonText}>
                {loading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#bf953f',
    borderRadius: 2,
  },
  progressText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#bf953f',
    fontSize: 14,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  rolesContainer: {
    gap: 12,
  },
  roleCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  roleIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  subRolesContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  subRolesTitle: {
    color: '#94a3b8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  subRolesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  subRoleCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  subRoleIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  subRoleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  formContainer: {
    maxHeight: 450,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    padding: 14,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  nextButton: {
    backgroundColor: '#bf953f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 14,
  },
  summaryValue: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
