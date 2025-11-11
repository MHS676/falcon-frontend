import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, MessageSquare, Clock } from 'lucide-react';
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

const AdminChat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [adminName] = useState('Admin'); // You can make this dynamic
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
      socketConnection.emit('admin_join');
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
    });

    socketConnection.on('admin_message_sent', (message: Message) => {
      if (selectedSession && selectedSession.id === message.sessionId) {
        setMessages(prev => [...prev, message]);
      }
    });

    setSocket(socketConnection);
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
      await fetch(`${API_URL}/api/messaging/session/${session.id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, // Assuming admin is logged in
          'Content-Type': 'application/json'
        }
      });

      // Update session in the list to show messages are read
      setSessions(prev => prev.map(s => 
        s.id === session.id 
          ? { ...s, _count: { messages: 0 } }
          : s
      ));
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
        alert('Failed to send message');
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sessions Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Active Chats ({sessions.length})
          </h2>
        </div>
        
        <div className="space-y-1">
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              onClick={() => selectSession(session)}
              className={`p-4 cursor-pointer transition-colors ${
                selectedSession?.id === session.id
                  ? 'bg-blue-50 border-r-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              whileHover={{ x: 4 }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-800">
                    {session.guestName || 'Anonymous User'}
                  </h3>
                  {session.guestEmail && (
                    <p className="text-xs text-gray-500">{session.guestEmail}</p>
                  )}
                </div>
                {session._count.messages > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {session._count.messages}
                  </span>
                )}
              </div>
              
              {session.messages.length > 0 && (
                <p className="text-sm text-gray-600 truncate mb-1">
                  {session.messages[0].content}
                </p>
              )}
              
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(session.lastActivity)}
              </div>
            </motion.div>
          ))}
          
          {sessions.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active chat sessions</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-800">
                {selectedSession.guestName || 'Anonymous User'}
              </h3>
              {selectedSession.guestEmail && (
                <p className="text-sm text-gray-500">{selectedSession.guestEmail}</p>
              )}
              <p className="text-xs text-gray-400">
                Session started: {formatDate(selectedSession.createdAt)}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderType === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderType === 'admin'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="mb-1">{message.content}</div>
                    <div className={`text-xs ${
                      message.senderType === 'admin' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.senderName} • {formatTime(message.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={sendReply}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a chat session to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChat;