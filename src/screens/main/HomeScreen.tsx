import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import UserCard from '../../components/common/UserCard';
import BottomNav from '../../components/main/BottomNav';
import { MOCK_USERS } from '../../constants/config';

const HomeScreen: React.FC<{ navigation: any }> = () => {
  const { user, wallet } = useApp();
  const [activeTab, setActiveTab] = useState<'nearby' | 'suggestions'>('nearby');

  // تحويل بيانات المستخدمين إلى الشكل المطلوب
  const displayUsers = MOCK_USERS.map(user => ({
    ...user,
    trustScore: user.trustScore,
    isVeryNear: parseFloat(user.distance) < 1,
  }));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>مرحباً {user?.name || 'مستخدم'} 👋</Text>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>💰 {wallet.balance} عملة</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'nearby' && styles.activeTab]}
          onPress={() => setActiveTab('nearby')}
        >
          <Text style={[styles.tabText, activeTab === 'nearby' && styles.activeTabText]}>
            📍 قريب
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
          onPress={() => setActiveTab('suggestions')}
        >
          <Text style={[styles.tabText, activeTab === 'suggestions' && styles.activeTabText]}>
            ✨ اقتراحات
          </Text>
        </TouchableOpacity>
      </View>

      {/* Users List */}
      <ScrollView 
        style={styles.usersList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.usersListContent}
      >
        {displayUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            showDistance={true}
          />
        ))}
      </ScrollView>

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  balanceContainer: {
    backgroundColor: 'rgba(191, 149, 63, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  balanceText: {
    color: '#bf953f',
    fontSize: 12,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(191, 149, 63, 0.15)',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#bf953f',
  },
  usersList: {
    flex: 1,
  },
  usersListContent: {
    paddingBottom: 80,
  },
});

export default HomeScreen;
