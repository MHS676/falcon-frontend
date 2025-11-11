import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    connectToChat();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Auto-scroll removed as requested

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

  // Scroll functionality removed as requested

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
    <div className="flex bg-gray-50 -m-6" style={{ height: 'calc(100vh - 80px)' }}>
      {/* Sessions Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 h-full">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Falcon Security Support</h2>
                <p className="text-blue-100 text-sm">Real-time Customer Messaging</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-sm font-medium">
                  {isConnected ? 'Online' : 'Connecting...'}
                </span>
              </div>
              {getUnreadCount() > 0 && (
                <div className="bg-red-500 text-white px-3 py-2 rounded-lg font-medium text-sm animate-bounce">
                  {getUnreadCount()} New Messages
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{sessions.length} Active Chats</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>24/7 Support</span>
              </div>
            </div>
            <div className="text-xs text-blue-100">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              onClick={() => selectSession(session)}
              className={`p-5 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-b border-gray-100 ${
                selectedSession?.id === session.id
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-r-4 border-blue-500 shadow-lg'
                  : ''
              }`}
              whileHover={{ scale: 1.02, x: 6 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-xl p-3 mr-4 shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    {session._count.messages > 0 && (
                      <div className="absolute -top-2 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce border-2 border-white">
                        {session._count.messages}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base">
                      {session.guestName || 'Anonymous User'}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      {session.guestEmail && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {session.guestEmail}
                        </div>
                      )}
                      <div className="flex items-center text-xs text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {session.messages.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-xl mb-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1 font-medium">Latest message:</div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    "{session.messages[0].content.length > 60 
                      ? session.messages[0].content.substring(0, 60) + '...' 
                      : session.messages[0].content}"
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(session.lastActivity)}
                  </div>
                  <div className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatTime(session.lastActivity)}
                  </div>
                </div>
                {selectedSession?.id === session.id && (
                  <div className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                    Active Chat
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {sessions.length === 0 && (
            <div className="p-12 text-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-8 mb-6">
                <MessageSquare className="w-20 h-20 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Ready for Customer Support</h3>
                <p className="text-gray-600 leading-relaxed">
                  Falcon Security Limited support is online and ready to help customers. 
                  New chat sessions will appear here automatically when customers reach out.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="font-medium text-green-800">Response Time</div>
                  <div className="text-green-600">Average: &lt; 2 minutes</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-800">Availability</div>
                  <div className="text-blue-600">24/7 Support</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-blue-50 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-2xl p-4 mr-5 shadow-lg">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl mb-1">
                      {selectedSession.guestName || 'Anonymous User'}
                    </h3>
                    <div className="flex items-center space-x-6 text-sm">
                      {selectedSession.guestEmail && (
                        <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                          <Mail className="w-4 h-4 mr-2" />
                          {selectedSession.guestEmail}
                        </div>
                      )}
                      <div className="flex items-center text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                        <Calendar className="w-4 h-4 mr-2" />
                        Started: {formatDate(selectedSession.createdAt)}
                      </div>
                      <div className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        Active Chat
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <div className="text-sm font-semibold text-gray-700 mb-1">Session Details</div>
                  <div className="text-xs text-gray-500 font-mono mb-2">
                    ID: {selectedSession.sessionToken.substring(0, 12)}...
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    🛡️ Falcon Security Support
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-4 bg-gray-50 min-h-0">
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
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-white to-blue-50">
              <div className="mb-3 flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Falcon Security Support - Responding as: {adminName}</span>
              </div>
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your professional response to help this customer..."
                    rows={3}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 resize-none bg-white shadow-sm transition-all duration-200"
                  />
                </div>
                <motion.button
                  onClick={sendReply}
                  disabled={!newMessage.trim() || !isConnected}
                  className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-6 h-6" />
                </motion.button>
              </div>
              <div className="mt-3 flex justify-between items-center text-xs">
                <div className="text-gray-500">
                  <span className="font-medium">Tips:</span> Press Enter to send • Shift+Enter for new line • Be professional and helpful
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center px-2 py-1 rounded-full ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </div>
                  <div className="text-blue-600 font-medium">🛡️ Falcon Security</div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="text-center max-w-lg mx-auto p-12">
              <div className="relative mb-8">
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl p-8 w-32 h-32 mx-auto flex items-center justify-center shadow-2xl">
                  <MessageSquare className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white animate-bounce flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h3 className="text-3xl font-bold text-gray-800 mb-3">
                🛡️ Falcon Security Support Dashboard
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Welcome to the professional customer support center. Select any chat session from the sidebar 
                to begin assisting customers with their security needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <div className="font-semibold text-gray-800">System Status</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {isConnected ? 
                      <span className="text-green-600 font-medium">🟢 Online & Ready</span> : 
                      <span className="text-orange-600 font-medium">🟡 Connecting...</span>
                    }
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                  <div className="flex items-center mb-3">
                    <Clock className="w-4 h-4 text-blue-600 mr-2" />
                    <div className="font-semibold text-gray-800">Response Goal</div>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    &lt; 2 minutes average
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl">
                <div className="font-semibold text-lg mb-2">Professional Support Guidelines</div>
                <div className="text-blue-100 text-sm space-y-1">
                  <div>• Respond professionally and courteously</div>
                  <div>• Provide accurate security information</div>
                  <div>• Offer appropriate service recommendations</div>
                  <div>• Maintain Falcon Security standards</div>
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