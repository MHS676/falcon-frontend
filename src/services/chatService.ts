import { io, Socket } from 'socket.io-client';

export interface Message {
  id: string;
  sessionId: string;
  content: string;
  senderType: 'guest' | 'admin';
  senderName: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  sessionToken: string;
  guestName?: string;
  guestEmail?: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
}

class ChatService {
  private socket: Socket | null = null;
  private sessionToken: string | null = null;
  
  constructor() {
    // Get session token from localStorage
    this.sessionToken = localStorage.getItem('chat_session_token');
  }

  connect() {
    if (this.socket?.connected) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    this.socket = io(`${API_URL}/chat`, {
      query: {
        userType: 'guest',
        sessionToken: this.sessionToken
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      if (this.sessionToken) {
        this.socket?.emit('join_session', { sessionToken: this.sessionToken });
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(content: string, guestName?: string, guestEmail?: string) {
    if (!this.socket) return Promise.reject('Not connected');

    return new Promise((resolve, reject) => {
      this.socket?.emit('guest_message', {
        content,
        guestName,
        guestEmail,
        sessionToken: this.sessionToken
      }, (response: any) => {
        if (response.success) {
          // Store session token for future use
          if (response.sessionToken) {
            this.sessionToken = response.sessionToken;
            localStorage.setItem('chat_session_token', response.sessionToken);
          }
          resolve(response);
        } else {
          reject(response.error);
        }
      });
    });
  }

  onNewMessage(callback: (message: Message) => void) {
    this.socket?.on('new_message', callback);
  }

  onSessionMessages(callback: (messages: Message[]) => void) {
    this.socket?.on('session_messages', callback);
  }

  offNewMessage(callback: (message: Message) => void) {
    this.socket?.off('new_message', callback);
  }

  offSessionMessages(callback: (messages: Message[]) => void) {
    this.socket?.off('session_messages', callback);
  }

  getSessionToken() {
    return this.sessionToken;
  }

  // REST API methods for non-real-time operations
  async getSessionHistory(sessionToken: string): Promise<{ session: ChatSession | null; messages: Message[] }> {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    try {
      const response = await fetch(`${API_URL}/api/messaging/session/token/${sessionToken}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching session history:', error);
      return { session: null, messages: [] };
    }
  }
}

export const chatService = new ChatService();