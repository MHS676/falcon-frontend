import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, MessageSquare, Clock, User, Mail, Calendar } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  sessionId: string;
  content: string;
  senderType: 'guest' | 'admin';
  senderName: string;
  isRead: boolean;
  createdAt: string;
}

interface ChatSession {
  id: string;
  sessionToken: string;
  guestName?: string;
  guestEmail?: string;
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  messages: Message[];
  _count: {
    messages: number;
  };
}

const AdminMessaging: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [adminName] = useState('Falcon Security Support');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connectToChat();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectToChat = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    const socketConnection = io(`${API_URL}/chat`, {
      query: {
        userType: 'admin'
      }
    });

    socketConnection.on('connect', () => {
      console.log('Admin connected to chat server');
      setIsConnected(true);
      socketConnection.emit('admin_join');
    });

    socketConnection.on('disconnect', () => {
      console.log('Admin disconnected from chat server');
      setIsConnected(false);
    });

    socketConnection.on('active_sessions', (activeSessions: ChatSession[]) => {
      setSessions(activeSessions);
    });

    socketConnection.on('new_guest_message', (message: Message & { sessionToken: string }) => {
      // Update sessions to show new message
      setSessions(prev => prev.map(session => {
        if (session.id === message.sessionId) {
          return {
            ...session,
            messages: [message],
            lastActivity: message.createdAt,
            _count: {
              messages: session._count.messages + 1
            }
          };
        }
        return session;
      }));

      // If this session is currently selected, add message to messages
      if (selectedSession && selectedSession.id === message.sessionId) {
        setMessages(prev => [...prev, message]);
      }

      // Show browser notification for new messages
      if (Notification.permission === 'granted') {
        new Notification('New Chat Message', {
          body: `New message: ${message.content.substring(0, 50)}...`,
          icon: '/favicon.ico'
        });
      }
    });

    socketConnection.on('admin_message_sent', (message: Message) => {
      if (selectedSession && selectedSession.id === message.sessionId) {
        setMessages(prev => [...prev, message]);
      }
    });

    setSocket(socketConnection);

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectSession = async (session: ChatSession) => {
    setSelectedSession(session);
    
    // Load messages for this session
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/messaging/session/${session.id}/messages`);
      const sessionMessages = await response.json();
      setMessages(sessionMessages);

      // Mark messages as read
      const token = localStorage.getItem('adminToken');
      if (token) {
        await fetch(`${API_URL}/api/messaging/session/${session.id}/read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Update session in the list to show messages are read
        setSessions(prev => prev.map(s => 
          s.id === session.id 
            ? { ...s, _count: { messages: 0 } }
            : s
        ));
      }
    } catch (error) {
      console.error('Error loading session messages:', error);
    }
  };

  const sendReply = () => {
    if (!newMessage.trim() || !selectedSession || !socket) return;

    socket.emit('admin_reply', {
      content: newMessage,
      sessionId: selectedSession.id,
      adminName
    }, (response: any) => {
      if (response.success) {
        setNewMessage('');
      } else {
        alert('Failed to send message: ' + (response.error || 'Unknown error'));
      }
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getUnreadCount = () => {
    return sessions.reduce((total, session) => total + session._count.messages, 0);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sessions Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Chat Sessions
            </h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <Users className="w-4 h-4 mr-1" />
            {sessions.length} active sessions
            {getUnreadCount() > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {getUnreadCount()} unread
              </span>
            )}
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              onClick={() => selectSession(session)}
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                selectedSession?.id === session.id
                  ? 'bg-blue-100 border-r-4 border-blue-500'
                  : ''
              }`}
              whileHover={{ x: 4 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-2 mr-3">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {session.guestName || 'Anonymous User'}
                    </h3>
                    {session.guestEmail && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Mail className="w-3 h-3 mr-1" />
                        {session.guestEmail}
                      </div>
                    )}
                  </div>
                </div>
                {session._count.messages > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center animate-pulse">
                    {session._count.messages}
                  </span>
                )}
              </div>
              
              {session.messages.length > 0 && (
                <p className="text-sm text-gray-600 truncate mb-2 bg-gray-50 p-2 rounded">
                  "{session.messages[0].content}"
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(session.lastActivity)}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatTime(session.lastActivity)}
                </div>
              </div>
            </motion.div>
          ))}
          
          {sessions.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No active chats</h3>
              <p className="text-sm">Customer chat sessions will appear here when they start a conversation</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3 mr-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {selectedSession.guestName || 'Anonymous User'}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      {selectedSession.guestEmail && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {selectedSession.guestEmail}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Session started: {formatDate(selectedSession.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">Session ID</div>
                  <div className="text-xs text-gray-500 font-mono">
                    {selectedSession.sessionToken.substring(0, 8)}...
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No messages in this conversation yet</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      message.senderType === 'admin'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                    }`}
                  >
                    <div className="mb-2">{message.content}</div>
                    <div className={`text-xs flex items-center justify-between ${
                      message.senderType === 'admin' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span>{message.senderName}</span>
                      <span>{formatTime(message.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your reply..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <button
                  onClick={sendReply}
                  disabled={!newMessage.trim() || !isConnected}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Press Enter to send • Shift+Enter for new line
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="bg-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <MessageSquare className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Falcon Security Support Chat
              </h3>
              <p className="text-gray-600 mb-6">
                Select a chat session from the sidebar to start responding to customer inquiries. 
                New conversations will appear automatically when customers reach out.
              </p>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600">
                  <strong>Status:</strong> {isConnected ? 
                    <span className="text-green-600">Connected and ready</span> : 
                    <span className="text-red-600">Connecting...</span>
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessaging;