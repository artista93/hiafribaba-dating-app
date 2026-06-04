import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';

const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: '🏠' },
    { id: 'search', label: 'بحث', icon: '🔍' },
    { id: 'map', label: 'خريطة', icon: '🗺️' },
    { id: 'messages', label: 'رسائل', icon: '💬' },
    { id: 'profile', label: 'ملفي', icon: '👤' },
    { id: 'wallet', label: 'محفظتي', icon: '💰' },
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.navItem, activeTab === item.id && styles.navItemActive]}
          onPress={() => setActiveTab(item.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, activeTab === item.id && styles.navIconActive]}>
            {item.icon}
          </Text>
          <Text style={[styles.navLabel, activeTab === item.id && styles.navLabelActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingBottom: 12,
    backgroundColor: '#0f172a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: 'rgba(191, 149, 63, 0.15)',
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 2,
    color: '#64748b',
  },
  navIconActive: {
    color: '#bf953f',
  },
  navLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  navLabelActive: {
    color: '#bf953f',
  },
});

export default BottomNav;
