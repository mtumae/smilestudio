export interface User {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role?: string;
  }
  
  export interface Message {
    id: number;
    customerId: string;
    content: string;
    createdAt: Date;
    status: 'unread' | 'read' | 'responded';
    responseContent?: string | null;
    responseTime?: Date | null;
    updatedAt?: Date;
    isStarred?: boolean;
    respondedBy?: User | null;
    customer?: User;
    optimisticId?: number;
  }
  
  export interface Conversation {
    id: number;
    customerId: string;
    lastMessage: string;
    lastMessageAt: Date;
    unreadCount: number;
    isStarred: boolean;
    customer: User;
  }
  
  export interface TypingIndicator {
    userId: string;
    conversationId: string;
    createdAt: Date;
  }