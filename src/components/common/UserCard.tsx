import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    age: number;
    avatar: string;
    isVerified: boolean;
    distance?: string;
    trustScore?: number;
    isVeryNear?: boolean;
  };
  onPress?: () => void;
  showDistance?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress, showDistance = true }) => {
  const getTrustIcon = (score?: number) => {
    if (!score) return '⏳';
    if (score >= 90) return '✅';
    if (score >= 70) return '⭐';
    if (score >= 50) return '⚠️';
    return '❌';
  };

  const getTrustColor = (score?: number) => {
    if (!score) return '#64748b';
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#fbbf24';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        {user.isVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.age}>{user.age} سنة</Text>
        </View>
        
        <View style={styles.metaContainer}>
          {showDistance && user.distance && (
            <Text style={styles.distance}>📍 {user.distance} كم</Text>
          )}
          {user.trustScore !== undefined && (
            <Text style={[styles.trust, { color: getTrustColor(user.trustScore) }]}>
              {getTrustIcon(user.trustScore)} {user.trustScore}%
            </Text>
          )}
          {user.isVeryNear && (
            <Text style={styles.veryNear}>⭐ قريب جداً</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  age: {
    fontSize: 14,
    color: '#94a3b8',
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  distance: {
    fontSize: 12,
    color: '#10b981',
  },
  trust: {
    fontSize: 12,
  },
  veryNear: {
    fontSize: 10,
    color: '#fbbf24',
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
});

export default UserCard;
