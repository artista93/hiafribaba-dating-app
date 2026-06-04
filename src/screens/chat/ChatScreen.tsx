import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../../context/AppContext';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  isRead: boolean;
  isImage?: boolean;
  imageUrl?: string;
}

const ChatScreen: React.FC = () => {
  const { user, activeChat, setActiveChat, setActiveTab, sendMessage, startCall } = useApp();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // محاكاة لرسائل تجريبية
  useEffect(() => {
    if (activeChat) {
      const mockMessages: Message[] = [
        {
          id: '1',
          text: 'مرحباً، كيف حالك؟',
          senderId: activeChat.userId,
          timestamp: Date.now() - 3600000,
          isRead: true,
        },
        {
          id: '2',
          text: 'أهلاً، أنا بخير الحمدلله، وأنت؟',
          senderId: user?.id || '',
          timestamp: Date.now() - 3500000,
          isRead: true,
        },
        {
          id: '3',
          text: 'هل تود التعارف أكثر؟',
          senderId: activeChat.userId,
          timestamp: Date.now() - 3400000,
          isRead: true,
        },
      ];
      setMessages(mockMessages);
    }
  }, [activeChat]);

  const handleSend = () => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      senderId: user?.id || '',
      timestamp: Date.now(),
      isRead: false,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    
    // تمرير إلى آخر رسالة
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // محاكاة إرسال الرسالة
    if (sendMessage) {
      sendMessage(activeChat?.id || '', messageText);
    }
  };

  const handleCall = (type: 'voice' | 'video') => {
    if (activeChat?.user) {
      startCall(type, activeChat.user);
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.id;
    
    return (
      <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.otherMessageRow]}>
        <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.otherMessage]}>
          <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.otherMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isMyMessage ? styles.myMessageTime : styles.otherMessageTime]}>
            {formatTime(item.timestamp)}
            {isMyMessage && item.isRead && <Text> ✓✓</Text>}
          </Text>
        </View>
      </View>
    );
  };

  if (!activeChat) {
    return (
      <View style={styles.emptyContainer}>
        <StatusBar style="light" />
        <Text style={styles.emptyIcon}>💬</Text>
        <Text style={styles.emptyTitle}>لا توجد محادثة مفتوحة</Text>
        <Text style={styles.emptySubtitle}>اختر محادثة من قائمة الرسائل للبدء</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            setActiveChat(null);
            setActiveTab('messages');
          }}
        >
          <Text style={styles.backButtonText}>← العودة للرسائل</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => {
            setActiveChat(null);
            setActiveTab('messages');
          }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.userInfo} onPress={() => setActiveTab('profile')}>
          <Image source={{ uri: activeChat.user.avatar }} style={styles.userAvatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{activeChat.user.name}</Text>
            <View style={styles.userStatus}>
              {activeChat.user.isOnline && <View style={styles.onlineDot} />}
              <Text style={styles.userStatusText}>
                {activeChat.user.isOnline ? 'متصل الآن' : 'غير متصل'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.callButtons}>
          <TouchableOpacity style={styles.callButton} onPress={() => handleCall('voice')}>
            <Text style={styles.callIcon}>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton} onPress={() => handleCall('video')}>
            <Text style={styles.callIcon}>🎥</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {/* Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Text style={styles.attachIcon}>📎</Text>
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="اكتب رسالة..."
            placeholderTextColor="#64748b"
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!messageText.trim()}
          >
            <Text style={styles.sendIcon}>📤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
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
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#0f172a',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    color: '#bf953f',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  userStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 4,
  },
  userStatusText: {
    fontSize: 11,
    color: '#64748b',
  },
  callButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(191, 149, 63, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callIcon: {
    fontSize: 18,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageRow: {
    marginBottom: 12,
  },
  myMessageRow: {
    alignItems: 'flex-end',
  },
  otherMessageRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myMessage: {
    backgroundColor: '#bf953f',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#0f172a',
  },
  otherMessageText: {
    color: '#f8fafc',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  myMessageTime: {
    color: '#0f172a',
    opacity: 0.7,
  },
  otherMessageTime: {
    color: '#64748b',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#0f172a',
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachIcon: {
    fontSize: 20,
    color: '#64748b',
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    color: '#f8fafc',
    fontSize: 15,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#bf953f',
    borderRadius: 20,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    fontSize: 18,
    color: '#0f172a',
  },
  backButtonText: {
    color: '#bf953f',
    fontSize: 14,
  },
});

export default ChatScreen;
