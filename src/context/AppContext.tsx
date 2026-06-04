import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, MOCK_USERS } from '../constants/config';
import { User, Chat, NearbyUser, Wallet, NotificationSettings, PrivacySettings } from '../types';

interface AppContextType {
  // State
  user: User | null;
  userType: 'male' | 'female' | 'active' | 'passive' | null;
  isLoading: boolean;
  chats: Chat[];
  activeChat: Chat | null;
  nearbyUsers: NearbyUser[];
  wallet: Wallet;
  notificationSettings: NotificationSettings;
  privacySettings: PrivacySettings;
  activeTab: string;
  
  // Actions
  login: (phone: string, password: string, userType: 'male' | 'female' | 'active' | 'passive') => void;
  logout: () => void;
  setActiveTab: (tab: string) => void;
  setActiveChat: (chat: Chat | null) => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  updatePrivacySettings: (settings: PrivacySettings) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [wallet] = useState<Wallet>({ balance: 500, earnings: 0, transactions: [] });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newMessage: true,
    showPreview: true,
    mute: false,
  });
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    gpsOffset: 0,
    hideAge: false,
    hideFromNearby: false,
    verifiedOnlyChat: false,
    ghostMode: false,
  });

  // المستخدمين القريبين (بيانات تجريبية)
  const [nearbyUsers] = useState<NearbyUser[]>(
    MOCK_USERS.map(user => ({
      ...user,
      id: user.id,
      name: user.name,
      age: user.age,
      location: user.location,
      lat: 33.5731 + (Math.random() - 0.5) * 0.1,
      lng: -7.5898 + (Math.random() - 0.5) * 0.1,
      userType: 'female',
      isVerified: user.isVerified,
      isOnline: true,
      lastSeen: Date.now(),
      avatar: user.avatar,
      rating: user.trustScore / 10,
      totalDates: 0,
      trustScore: user.trustScore,
      distance: user.distance,
      isVeryNear: parseFloat(user.distance) < 1,
    }))
  );

  const userType = user?.userType || null;

  // تحميل الإعدادات المحفوظة
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      
      const savedNotifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      if (savedNotifications) {
        setNotificationSettings(JSON.parse(savedNotifications));
      }
      
      const savedPrivacy = await AsyncStorage.getItem(STORAGE_KEYS.PRIVACY_SETTINGS);
      if (savedPrivacy) {
        setPrivacySettings(JSON.parse(savedPrivacy));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (phone: string, password: string, userType: 'male' | 'female' | 'active' | 'passive') => {
    const newUser: User = {
      id: Date.now().toString(),
      name: userType === 'male' || userType === 'active' ? 'أحمد' : 'سارة',
      phone,
      age: 28,
      location: 'الدار البيضاء',
      lat: 33.5731,
      lng: -7.5898,
      userType,
      isVerified: true,
      isOnline: true,
      lastSeen: Date.now(),
      avatar: `https://randomuser.me/api/portraits/${userType === 'male' || userType === 'active' ? 'men' : 'women'}/1.jpg`,
      rating: 4.5,
      totalDates: 0,
      trustScore: 100,
    };
    
    setUser(newUser);
    AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  };

  const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setActiveTab('home');
    setActiveChat(null);
  };

  const updateNotificationSettings = async (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
  };

  const updatePrivacySettings = async (settings: PrivacySettings) => {
    setPrivacySettings(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.PRIVACY_SETTINGS, JSON.stringify(settings));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        userType,
        isLoading,
        chats,
        activeChat,
        nearbyUsers,
        wallet,
        notificationSettings,
        privacySettings,
        activeTab,
        login,
        logout,
        setActiveTab,
        setActiveChat,
        updateNotificationSettings,
        updatePrivacySettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
