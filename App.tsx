import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';
import { AppProvider, useApp } from './src/context/AppContext';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import ProfileScreen from './src/screens/profile/ProfileScreen';
import SettingsMainScreen from './src/screens/settings/SettingsScreen';
import WalletScreen from './src/screens/wallet/WalletScreen';
import MapScreen from './src/screens/map/MapScreen';
import MessagesScreen from './src/screens/messages/MessagesScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import SearchScreen from './src/screens/search/SearchScreen';
import './src/App.css';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, activeTab } = useApp();

  const getCurrentScreen = () => {
    switch (activeTab) {
      case 'home': return HomeScreen;
      case 'search': return SearchScreen;
      case 'messages': return MessagesScreen;
      case 'chat': return ChatScreen;
      case 'profile': return ProfileScreen;
      case 'settings': return SettingsMainScreen;
      case 'map': return MapScreen;
      case 'wallet': return WalletScreen;
      default: return HomeScreen;
    }
  };

  const CurrentScreen = getCurrentScreen();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name="Main">
          {() => <CurrentScreen />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  // تحديد المسار الأساسي: فقط للويب وعلى GitHub Pages
  const getBasename = () => {
    if (Platform.OS === 'web') {
      // التحقق إذا كنا على GitHub Pages
      if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
        return '/hiafribaba-dating-app';
      }
    }
    return '/';
  };

  return (
    <AppProvider>
      <NavigationContainer basename={getBasename()}>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
