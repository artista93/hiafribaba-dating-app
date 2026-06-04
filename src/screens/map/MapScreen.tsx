import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BottomNav from '../../components/main/BottomNav';

const MapScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.center}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={styles.title}>خريطة الموقع</Text>
        <Text style={styles.message}>
          ميزة الخريطة متوفرة فقط على تطبيق الهاتف المحمول
        </Text>
        <Text style={styles.note}>
          قم بتحميل التطبيق على هاتفك الذكي لاستخدام هذه الميزة
        </Text>
      </View>
      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  icon: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#bf953f',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 8,
  },
  note: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default MapScreen;
