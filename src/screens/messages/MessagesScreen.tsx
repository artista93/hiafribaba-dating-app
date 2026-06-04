import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';
import BottomNav from '../../components/main/BottomNav';

interface ChatPreview {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isVerified: boolean;
}

const MessagesScreen: React.FC = () => {
  const { user, setActiveChat, setActiveTab, startCall } = useApp();
  
  // بيانات تجريبية للمحادثات
  const [chats, setChats] = useState<ChatPreview[]>([
    {
      id: '1',
      userId: '101',
      name: 'سارة',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      lastMessage: 'أهلاً، كيف حالك؟',
      lastMessageTime: '10:30',
      unreadCount: 2,
      isOnline: true,
      isVerified: true,
    },
    {
      id: '2',
      userId: '102',
      name: 'فاطمة',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      lastMessage: 'متى يمكننا اللقاء؟',
      lastMessageTime: '09:15',
      unreadCount: 0,
      isOnline: false,
      isVerified: true,
    },
    {
      id: '3',
      userId: '103',
      name: 'نادية',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      lastMessage: 'شكراً لك 😊',
      lastMessageTime: 'أمس',
      unreadCount: 0,
      isOnline: true,
      isVerified: false,
    },
    {
      id: '4',
      userId: '104',
      name: 'ليلى',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      lastMessage: 'هل أنت حر اليوم؟',
      lastMessageTime: 'أمس',
      unreadCount: 5,
      isOnline: false,
      isVerified: true,
    },
  ]);

  const handleChatPress = (chat: ChatPreview) => {
    // تحويل البيانات إلى تنسيق Chat المتوقع
    const fullChat = {
      id: chat.id,
      userId: chat.userId,
      user: {
        id: chat.userId,
        name: chat.name,
        avatar: chat.avatar,
        isVerified: chat.isVerified,
        isOnline: chat.isOnline,
      },
      lastMessage: chat.lastMessage,
      lastMessageTime: chat.lastMessageTime,
      unreadCount: chat.unreadCount,
      messages: [],
    };
    setActiveChat(fullChat as any);
    setActiveTab('chat');
  };

  const handleCallPress = (chat: ChatPreview, type: 'voice' | 'video') => {
    const callUser = {
      id: chat.userId,
      name: chat.name,
      avatar: chat.avatar,
    };
    startCall(type, callUser as any);
  };

  const formatTime = (time: string) => {
    if (time === 'أمس') return time;
    return time;
  };

  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineDot} />}
        {item.isVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓</Text>
          </View>
        )}
      </View>
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{formatTime(item.lastMessageTime)}</Text>
        </View>
        
        <View style={styles.chatPreview}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.chatActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleCallPress(item, 'voice')}
        >
          <Text style={styles.actionIcon}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleCallPress(item, 'video')}
        >
          <Text style={styles.actionIcon}>🎥</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>لا توجد رسائل بعد</Text>
      <Text style={styles.emptySubtitle}>
        ابدأ محادثة مع أحد المستخدمين للتواصل
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 الرسائل</Text>
      </View>
      
      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
      
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  chatList: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
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
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#0f172a',
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
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  chatTime: {
    fontSize: 11,
    color: '#64748b',
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 13,
    color: '#94a3b8',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#bf953f',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#0f172a',
    fontSize: 10,
    fontWeight: 'bold',
  },
  chatActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default MessagesScreen;
