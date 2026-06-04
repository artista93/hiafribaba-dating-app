import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../../context/AppContext';
import BottomNav from '../../components/main/BottomNav';
import SettingsMainScreen from '../settings/SettingsScreen';

const { width } = Dimensions.get('window');

const VIP_PLANS = [
  { 
    id: 'vip', 
    name: 'VIP', 
    price: 150, 
    colors: ['#fbbf24', '#d97706'],
    features: [
      'لا توجد إعلانات',
      'الدردشة بحرية',
      'إطار خاص',
      'ماس لامع',
    ]
  },
  { 
    id: 'super', 
    name: 'Super VIP', 
    price: 300, 
    colors: ['#f97316', '#ea580c'],
    features: [
      'لا توجد إعلانات',
      'الدردشة بحرية',
      'إطار خاص',
      'ماس لامع',
      'ظهور في قائمة VIP',
      'من زار صفحتي الشخصية',
    ]
  },
  { 
    id: 'ultimate', 
    name: 'Ultimate VIP', 
    price: 600, 
    colors: ['#bf953f', '#b38728'],
    features: [
      'لا توجد إعلانات',
      'الدردشة بحرية',
      'إطار خاص',
      'ماس لامع',
      'ظهور في قائمة VIP',
      'من زار صفحتي الشخصية',
      'رسائل أولوية',
      'قائمة أصدقاء غير محدودة',
      'قائمة سوداء غير محدودة',
      'اسم متلألئ',
      'الصورة الشخصية الديناميكية',
      'إزالة آثار أقدام',
      'البحث المتقدم المجاني',
      'الوضع الخفي',
    ]
  },
];

const ProfileScreen: React.FC = () => {
  const { user, wallet, logout, setActiveTab } = useApp();
  const [showSettings, setShowSettings] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  const handleSubscribe = () => {
    const plan = VIP_PLANS[selectedPlan];
    Alert.alert(
      'الاشتراك في الباقة',
      `سعر الاشتراك في ${plan.name} هو ${plan.price} درهم/شهر`,
      [
        { text: 'إلغاء', style: 'cancel' },
        { text: 'اشتراك', onPress: () => Alert.alert('نجاح', `تم الاشتراك في ${plan.name} بنجاح!`) },
      ]
    );
  };

  if (showSettings) {
    return <SettingsMainScreen onBack={() => setShowSettings(false)} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettings(true)}>
            <Text style={styles.settingsText}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Image */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
        </View>

        {/* User Info */}
        <Text style={styles.userName}>{user?.name || 'أحمد'}</Text>
        <Text style={styles.userInfo}>
          {user?.userType === 'male' && '♂️ رجل'}
          {user?.userType === 'female' && '♀️ امرأة'}
          {user?.userType === 'active' && '⚡ Active'}
          {user?.userType === 'passive' && '🌸 Passive'}
          {' • '}{user?.age || 28} سنة
        </Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>إعجاب</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>موعد</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>تقييم</Text>
          </View>
        </View>

        {/* Trust Score */}
        <View style={styles.trustContainer}>
          <Text style={styles.trustLabel}>⭐ نسبة الثقة: 85%</Text>
          <View style={styles.trustBar}>
            <View style={[styles.trustFill, { width: '85%' }]} />
          </View>
        </View>

        {/* VIP Section */}
        <View style={styles.vipSection}>
          <Text style={styles.vipTitle}>👑 العروض المميزة</Text>
          
          {/* VIP Cards Horizontal */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.vipScroll}
            contentContainerStyle={styles.vipScrollContent}
          >
            {VIP_PLANS.map((plan, index) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.vipCard,
                  selectedPlan === index && styles.vipCardActive,
                ]}
                onPress={() => setSelectedPlan(index)}
              >
                <LinearGradient
                  colors={plan.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.vipGradient}
                >
                  <Text style={styles.vipCardName}>{plan.name}</Text>
                  <Text style={styles.vipCardPrice}>{plan.price} <Text style={styles.vipCurrency}>د/شهر</Text></Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* عرض جميع الميزات */}
          <TouchableOpacity 
            style={styles.showAllButton}
            onPress={() => setShowFeaturesModal(true)}
          >
            <Text style={styles.showAllText}>عرض جميع الميزات</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <LinearGradient
              colors={VIP_PLANS[selectedPlan].colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.subscribeGradient}
            >
              <Text style={styles.subscribeText}>الاشتراك الآن - {VIP_PLANS[selectedPlan].price} درهم/شهر</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setActiveTab('wallet')}
          >
            <Text style={styles.actionButtonText}>💰 محفظتي ({wallet.balance} عملة)</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setActiveTab('search')}
          >
            <Text style={styles.actionButtonText}>🔍 ابدأ البحث</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={logout}>
            <Text style={[styles.actionButtonText, styles.logoutText]}>🚪 تسجيل الخروج</Text>
          </TouchableOpacity>
        </View>
        
        {/* مسافة أسفل للشريط */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Modal for showing all features */}
      <Modal
        visible={showFeaturesModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFeaturesModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                👑 مميزات {VIP_PLANS[selectedPlan].name}
              </Text>
              <TouchableOpacity onPress={() => setShowFeaturesModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {VIP_PLANS[selectedPlan].features.map((feature, index) => (
                <View key={index} style={styles.modalFeatureRow}>
                  <Text style={styles.modalFeatureCheck}>✓</Text>
                  <Text style={styles.modalFeatureText}>{feature}</Text>
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.modalSubscribeButton}
              onPress={() => {
                setShowFeaturesModal(false);
                handleSubscribe();
              }}
            >
              <LinearGradient
                colors={VIP_PLANS[selectedPlan].colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalSubscribeGradient}
              >
                <Text style={styles.modalSubscribeText}>
                  الاشتراك الآن - {VIP_PLANS[selectedPlan].price} درهم/شهر
                </Text>
              </LinearGradient>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerLeft: {
    width: 40,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsText: {
    fontSize: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(191, 149, 63, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#bf953f',
  },
  avatarText: {
    fontSize: 48,
  },
  userName: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  userInfo: {
    textAlign: 'center',
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  trustContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  trustLabel: {
    fontSize: 14,
    color: '#f8fafc',
    marginBottom: 8,
  },
  trustBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  trustFill: {
    height: 8,
    backgroundColor: '#bf953f',
    borderRadius: 4,
  },
  vipSection: {
    marginBottom: 24,
  },
  vipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  vipScroll: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  vipScrollContent: {
    paddingRight: 20,
  },
  vipCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  vipCardActive: {
    transform: [{ scale: 1.02 }],
  },
  vipGradient: {
    padding: 16,
    alignItems: 'center',
  },
  vipCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  vipCardPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  vipCurrency: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  showAllButton: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  showAllText: {
    color: '#bf953f',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  subscribeButton: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  subscribeGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  subscribeText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  actionButtonText: {
    color: '#f8fafc',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    color: '#f87171',
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
    width: width - 40,
    maxHeight: '80%',
    backgroundColor: '#1e293b',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(191,149,63,0.3)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
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
  modalContent: {
    maxHeight: 400,
  },
  modalFeatureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modalFeatureCheck: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  modalFeatureText: {
    fontSize: 14,
    color: '#f8fafc',
    flex: 1,
  },
  modalSubscribeButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalSubscribeGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalSubscribeText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
