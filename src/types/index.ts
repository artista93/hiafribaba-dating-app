export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age: number;
  location: string;
  lat: number;
  lng: number;
  userType: 'male' | 'female' | 'active' | 'passive';
  isVerified: boolean;
  isOnline: boolean;
  lastSeen: number;
  avatar: string;
  rating: number;
  totalDates: number;
  bio?: string;
  trustScore: number;
  pricePlans?: PricePlans;
}

export interface PricePlans {
  planA: number;
  planB: number;
  planC: number;
  paymentMethod?: 'electronic' | 'cash';
}

export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  timestamp: number;
  isRead: boolean;
  isImage?: boolean;
  imageUrl?: string;
}

export interface Chat {
  id: string;
  userId: string;
  user: User;
  lastMessage: string;
  lastMessageTime: number;
  lastMessageSender: 'me' | 'other';
  unreadCount: number;
  messages: Message[];
}

export interface NearbyUser extends User {
  distance: string;
  isVeryNear: boolean;
}

export interface Transaction {
  id: string;
  type: 'topup' | 'withdraw' | 'plan_purchase' | 'call_credit';
  amount: number;
  date: string;
  description: string;
}

export interface Wallet {
  balance: number;
  earnings: number;
  transactions: Transaction[];
}

export interface NotificationSettings {
  newMessage: boolean;
  showPreview: boolean;
  mute: boolean;
}

export interface PrivacySettings {
  gpsOffset: number;
  hideAge: boolean;
  hideFromNearby: boolean;
  verifiedOnlyChat: boolean;
  ghostMode: boolean;
}
