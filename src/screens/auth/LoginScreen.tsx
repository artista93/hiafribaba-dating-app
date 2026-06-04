import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';

const DEMO_PHONE = '0612345678';
const DEMO_PASSWORD = '123456';

const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال رقم الهاتف');
      return;
    }
    if (!password.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال كلمة المرور');
      return;
    }

    if (phone !== DEMO_PHONE || password !== DEMO_PASSWORD) {
      Alert.alert('خطأ', 'رقم الهاتف أو كلمة المرور غير صحيحة');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(phone, password, 'male');
      setLoading(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>💜</Text>
          <Text style={styles.appName}>hiafribaba</Text>
        </View>
        <Text style={styles.subtitle}>تطبيق مواعدة آمن ومشفر</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>رقم الهاتف</Text>
            <TextInput
              style={styles.input}
              placeholder="0612345678"
              placeholderTextColor="#64748b"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>كلمة المرور</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="********"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#0f172a" />
            ) : (
              <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={styles.registerLink}
            activeOpacity={0.7}
          >
            <Text style={styles.registerText}>
              ليس لديك حساب؟ <Text style={styles.registerHighlight}>إنشاء حساب جديد</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoInfo}>
          <Text style={styles.demoTitle}>📱 حساب تجريبي للاختبار</Text>
          <Text style={styles.demoText}>رقم الهاتف: {DEMO_PHONE}</Text>
          <Text style={styles.demoText}>كلمة المرور: {DEMO_PASSWORD}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#bf953f',
  },
  subtitle: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 48,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  eyeText: {
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#bf953f',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    color: '#64748b',
    fontSize: 14,
  },
  registerHighlight: {
    color: '#bf953f',
    fontWeight: 'bold',
  },
  demoInfo: {
    marginTop: 40,
    padding: 16,
    backgroundColor: 'rgba(191, 149, 63, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(191, 149, 63, 0.3)',
  },
  demoTitle: {
    color: '#bf953f',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  demoText: {
    color: '#94a3b8',
    fontSize: 11,
    textAlign: 'center',
  },
});

export default LoginScreen;
