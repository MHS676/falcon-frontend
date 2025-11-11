import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { chatService, Message } from '../../services/chatService';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if we have an existing session
    const sessionToken = chatService.getSessionToken();
    if (sessionToken) {
      loadSessionHistory(sessionToken);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !isConnected) {
      chatService.connect();
      setIsConnected(true);

      // Listen for new messages
      chatService.onNewMessage((message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for session messages (initial load)
      chatService.onSessionMessages((sessionMessages: Message[]) => {
        setMessages(sessionMessages);
      });

      return () => {
        chatService.offNewMessage(() => {});
        chatService.offSessionMessages(() => {});
      };
    }
  }, [isOpen, isConnected]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadSessionHistory = async (sessionToken: string) => {
    try {
      const { session, messages: sessionMessages } = await chatService.getSessionHistory(sessionToken);
      if (session && sessionMessages) {
        setMessages(sessionMessages);
      }
    } catch (error) {
      console.error('Error loading session history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendWelcomeMessage = async () => {
    if (!hasStartedChat) {
      setHasStartedChat(true);
      // Send auto-welcome message after user's first message
      setTimeout(async () => {
        try {
          const welcomeMsg = `Hello${userName ? ` ${userName}` : ''}! 👋 Welcome to Falcon Security Limited. Thank you for contacting us. Our security experts will respond to your inquiry shortly. How can we assist you with your security needs today?`;
          
          // Simulate admin welcome message
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            sessionId: chatService.getSessionToken() || '',
            content: welcomeMsg,
            senderType: 'admin',
            senderName: 'Falcon Security Support',
            isRead: false,
            createdAt: new Date().toISOString()
          };
          
          setMessages(prev => [...prev, welcomeMessage]);
        } catch (error) {
          console.error('Error sending welcome message:', error);
        }
      }, 1500); // Send welcome message after 1.5 seconds
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const displayName = userName.trim() || 'Anonymous User';
      await chatService.sendMessage(newMessage, displayName);
      setNewMessage('');
      setShowNameInput(false);
      
      // Send welcome message after first user message
      if (!hasStartedChat) {
        sendWelcomeMessage();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <motion.button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <h3 className="font-semibold">Chat with Falcon Security</h3>
              <p className="text-xs opacity-90">We're here to help!</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm">
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <div className="text-blue-600 text-lg mb-2">🛡️ Falcon Security Limited</div>
                    <div className="text-gray-700 font-medium mb-2">Professional Security Solutions</div>
                    <div className="text-xs text-gray-600">
                      Our security experts are ready to help! Start a conversation below.
                    </div>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.senderType === 'guest' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-sm ${
                      message.senderType === 'guest'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                    }`}
                  >
                    <div className="mb-2">{message.content}</div>
                    <div className={`text-xs flex justify-between items-center ${
                      message.senderType === 'guest' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span className="font-medium">
                        {message.senderType === 'admin' ? '🛡️ Support' : '👤 You'}
                      </span>
                      <span>{formatTime(message.createdAt)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Name Input Section */}
            {showNameInput && messages.length === 0 && (
              <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">👤</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">What should we call you?</div>
                    <div className="text-xs text-gray-600">Optional - helps us personalize our service</div>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setShowNameInput(false);
                    }
                  }}
                />
              </div>
            )}

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Type your message${userName ? `, ${userName}` : ''}...`}
                    disabled={isSending}
                    rows={2}
                    className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 disabled:opacity-50 resize-none"
                  />
                </div>
                <motion.button
                  onClick={handleSendMessage}
                  disabled={isSending || !newMessage.trim()}
                  className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
                <span>Press Enter to send • Shift+Enter for new line</span>
                {userName && (
                  <span className="text-blue-600 font-medium">Chatting as: {userName}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;