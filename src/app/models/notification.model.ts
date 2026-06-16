export interface AppNotification {
  id: number;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type?: string;
  createdAt: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}