// استخدم IP جهازك الحقيقي عند التشغيل على الهاتف
export const API_URL = 'http://localhost:3000';
export const SOCKET_URL = 'http://localhost:3000';

export const COLORS = {
  primary: '#bf953f',
  primaryDark: '#b38728',
  primaryLight: '#fcf6ba',
  background: '#0f172a',
  backgroundLight: '#1e293b',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  SETTINGS: 'settings',
  NOTIFICATION_SETTINGS: 'notification_settings',
  PRIVACY_SETTINGS: 'privacy_settings',
  PASSCODE: 'passcode',
};

export const PRICE_PLANS = {
  A: 100,
  B: 200,
  C: 300,
};

export const COMMISSION_RATE = 0.15; // 15%

export const GPS_OFFSET_OPTIONS = [
  { value: 0, label: 'بدون', distance: '0m' },
  { value: 100, label: 'خفيف', distance: '100m' },
  { value: 200, label: 'متوسط', distance: '200m' },
  { value: 500, label: 'قوي', distance: '500m' },
  { value: 1000, label: 'شديد', distance: '1km' },
];

export const VIP_PLANS = [
  { id: 'vip', name: 'VIP', price: 150, colors: ['#fbbf24', '#d97706'] },
  { id: 'super', name: 'Super VIP', price: 300, colors: ['#f97316', '#ea580c'] },
  { id: 'ultimate', name: 'Ultimate VIP', price: 600, colors: ['#bf953f', '#b38728'] },
];

export const MOCK_USERS = [
  { id: '1', name: 'سارة', age: 24, distance: '0.5', trustScore: 100, isVerified: true, avatar: 'https://randomuser.me/api/portraits/women/1.jpg', location: 'الدار البيضاء' },
  { id: '2', name: 'فاطمة', age: 27, distance: '1.2', trustScore: 85, isVerified: true, avatar: 'https://randomuser.me/api/portraits/women/2.jpg', location: 'الرباط' },
  { id: '3', name: 'نادية', age: 30, distance: '2.3', trustScore: 75, isVerified: false, avatar: 'https://randomuser.me/api/portraits/women/3.jpg', location: 'مراكش' },
  { id: '4', name: 'ليلى', age: 22, distance: '0.8', trustScore: 95, isVerified: true, avatar: 'https://randomuser.me/api/portraits/women/4.jpg', location: 'طنجة' },
];
