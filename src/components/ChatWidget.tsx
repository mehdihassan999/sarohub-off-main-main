import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Minus,
  Sparkles,
  RefreshCw,
  Cpu,
  Trash2,
  ChevronDown,
  Plus,
  Copy,
  Check,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api';
import { ChatMessage, ChatSession } from '../types';

interface SavedConversationSummary {
  id: string;
  preview: string;
  updatedAt: string;
  messageCount: number;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [agentStatus, setAgentStatus] = useState<'online' | 'away' | 'offline'>('online');
  const [isSending, setIsSending] = useState(false);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [hasNewUnread, setHasNewUnread] = useState(false);
  const [isWaitingForReply, setIsWaitingForReply] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<SavedConversationSummary[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

  // Dedicated container ref for internal scrolling ONLY (prevents outer webpage from jumping)
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper to load user's conversations list from localStorage
  const loadSavedConversationsList = (): SavedConversationSummary[] => {
    try {
      const stored = localStorage.getItem('sarohub_chat_conversations_history');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse chat conversations history', e);
    }
    return [];
  };

  const saveConversationSummary = (sessId: string, msgs: ChatMessage[]) => {
    if (!sessId) return;
    try {
      const currentList = loadSavedConversationsList();
      const nonSystem = msgs.filter(m => m.sender !== 'system');
      const lastMsg = nonSystem.length > 0 ? nonSystem[nonSystem.length - 1] : (msgs.length > 0 ? msgs[msgs.length - 1] : null);
      let previewText = 'New Conversation';
      if (lastMsg) {
        previewText = lastMsg.text.replace(/^\[AI Assistant\]\s*/, '').trim().slice(0, 45);
      }

      const existingIndex = currentList.findIndex(item => item.id === sessId);
      const summaryItem: SavedConversationSummary = {
        id: sessId,
        preview: previewText || 'Conversation thread',
        updatedAt: new Date().toISOString(),
        messageCount: msgs.filter(m => m.sender !== 'system').length
      };

      let updatedList: SavedConversationSummary[];
      if (existingIndex >= 0) {
        currentList[existingIndex] = summaryItem;
        updatedList = [...currentList];
      } else {
        updatedList = [summaryItem, ...currentList].slice(0, 15); // keep latest 15 conversations
      }

      localStorage.setItem('sarohub_chat_conversations_history', JSON.stringify(updatedList));
      setConversationHistory(updatedList);
    } catch (err) {
      console.error('Failed to save conversation summary', err);
    }
  };

  // Safe container-only scrolling (does NOT scroll the outer window)
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  // 1. Initialize or load existing session from localStorage
  useEffect(() => {
    let storedSessionId = localStorage.getItem('sarohub_chat_session_id');
    const storedVisitorName = localStorage.getItem('sarohub_chat_visitor_name');
    const storedVisitorPhone = localStorage.getItem('sarohub_chat_visitor_phone');
    const storedVisitorEmail = localStorage.getItem('sarohub_chat_visitor_email');

    if (!storedSessionId) {
      storedSessionId = 'sess-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
      localStorage.setItem('sarohub_chat_session_id', storedSessionId);
    }

    setSessionId(storedSessionId);
    setConversationHistory(loadSavedConversationsList());

    if (storedVisitorName && storedVisitorPhone) {
      setVisitorName(storedVisitorName);
      setVisitorPhone(storedVisitorPhone);
      setVisitorEmail(storedVisitorEmail || '');
      setIsRegistered(true);
    }

    fetchAgentStatus();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // 2. Poll for new messages when widget is open and visitor is registered
  useEffect(() => {
    if (isOpen && isRegistered && sessionId) {
      fetchSessionDetails(sessionId);

      pollingIntervalRef.current = setInterval(() => {
        fetchSessionDetails(sessionId);
      }, 3500);
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isOpen, isRegistered, sessionId]);

  // Auto-scroll strictly within chat container on new messages or waiting changes
  useEffect(() => {
    if (isOpen) {
      scrollToBottom('smooth');
    }
  }, [messages, isWaitingForReply, isOpen]);

  const fetchAgentStatus = async () => {
    try {
      const res = await api.getAgentStatus();
      setAgentStatus(res.availability || 'online');
    } catch (err) {
      setAgentStatus('online');
    }
  };

  const fetchSessionDetails = async (targetSessionId = sessionId) => {
    if (!targetSessionId) return;
    try {
      const session: ChatSession = await api.getChatSession(targetSessionId);
      if (session) {
        const msgs = session.messages || [];
        setMessages(msgs);
        setSessionClosed(session.status === 'closed');
        saveConversationSummary(targetSessionId, msgs);

        if (session.visitor_unread && !isOpen) {
          setHasNewUnread(true);
        }

        // If we were waiting for a reply and received one, stop waiting
        if (isWaitingForReply) {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg && lastMsg.sender !== 'visitor') {
            setIsWaitingForReply(false);
          }
        }
      }
    } catch (err) {
      // Session might not be initialized on backend yet
    }
  };

  // Switch to an existing conversation
  const handleSelectConversation = (targetSessionId: string) => {
    if (targetSessionId === sessionId) {
      setShowDropdown(false);
      return;
    }
    setSessionId(targetSessionId);
    localStorage.setItem('sarohub_chat_session_id', targetSessionId);
    setShowDropdown(false);
    setIsWaitingForReply(false);
    fetchSessionDetails(targetSessionId);
  };

  // Start a fresh new conversation thread
  const handleStartNewConversation = () => {
    const newSessionId = 'sess-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
    localStorage.setItem('sarohub_chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setSessionClosed(false);
    setHasNewUnread(false);
    setIsWaitingForReply(false);
    setShowDropdown(false);

    const initialWelcomeMsg: ChatMessage = {
      id: 'welcome-' + Date.now(),
      sender: 'system',
      text: `New conversation initialized. RinaAI is online to assist you.`,
      created_at: new Date().toISOString()
    };
    setMessages([initialWelcomeMsg]);
    saveConversationSummary(newSessionId, [initialWelcomeMsg]);
  };

  // Delete entire conversation group
  const handleClearChat = async () => {
    const targetSessionId = sessionId;
    // Optimistically update local view first
    const newSessionId = 'sess-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
    localStorage.setItem('sarohub_chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'system',
        text: `Conversation cleared. RinaAI is online. How can we assist you today?`,
        created_at: new Date().toISOString()
      }
    ]);
    setSessionClosed(false);
    setHasNewUnread(false);
    setShowClearConfirm(false);

    // Remove from local conversation history
    const remaining = loadSavedConversationsList().filter(item => item.id !== targetSessionId);
    localStorage.setItem('sarohub_chat_conversations_history', JSON.stringify(remaining));
    setConversationHistory(remaining);

    try {
      if (targetSessionId) {
        await api.deleteChatSession(targetSessionId);
      }
    } catch (err) {
      console.warn('Failed to delete chat session on server:', err);
    }
  };

  // Delete a single message with instant optimistic removal
  const handleDeleteSingleMessage = async (e: React.MouseEvent, msgId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!sessionId || !msgId) return;

    setDeletingMessageId(msgId);

    // Instant optimistic update on local UI
    setMessages(prev => {
      const updated = prev.filter(m => String(m.id) !== String(msgId));
      saveConversationSummary(sessionId, updated);
      return updated;
    });

    try {
      await api.deleteChatMessage(sessionId, msgId);
    } catch (err) {
      console.warn('Backend delete message call failed or was local-only:', err);
    } finally {
      setDeletingMessageId(null);
    }
  };

  // Copy message text to clipboard
  const handleCopyMessage = (e: React.MouseEvent, msgId: string, text: string) => {
    e.stopPropagation();
    e.preventDefault();
    const cleanText = text.replace(/^\[AI Assistant\]\s*/, '').trim();
    navigator.clipboard.writeText(cleanText);
    setCopiedMessageId(msgId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await Promise.all([fetchSessionDetails(sessionId), fetchAgentStatus()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) return;

    localStorage.setItem('sarohub_chat_visitor_name', visitorName);
    localStorage.setItem('sarohub_chat_visitor_phone', visitorPhone);
    localStorage.setItem('sarohub_chat_visitor_email', visitorEmail);
    setIsRegistered(true);

    const initialWelcomeMsg: ChatMessage = {
      id: 'welcome-' + Date.now(),
      sender: 'system',
      text: `RinaAI is online. Welcome, ${visitorName}! How can I assist you with SaroHub's software development, AI solutions, or venture building today?`,
      created_at: new Date().toISOString()
    };
    setMessages([initialWelcomeMsg]);
    saveConversationSummary(sessionId, [initialWelcomeMsg]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !sessionId || isSending) return;

    if (sessionClosed) {
      setSessionClosed(false);
    }

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);
    setIsWaitingForReply(true);

    const tempId = 'temp-' + Date.now();
    const newMsg: ChatMessage = {
      id: tempId,
      sender: 'visitor',
      text: messageText,
      created_at: new Date().toISOString()
    };

    setMessages(prev => {
      const updated = [...prev, newMsg];
      saveConversationSummary(sessionId, updated);
      return updated;
    });

    try {
      const res = await api.sendChatMessage(sessionId, {
        sender: 'visitor',
        text: messageText,
        visitorName,
        visitorPhone,
        visitorEmail
      });

      if (res && res.session && res.session.messages) {
        setMessages(res.session.messages);
        setSessionClosed(false);
        saveConversationSummary(sessionId, res.session.messages);
        setIsWaitingForReply(false);
      } else {
        await fetchSessionDetails(sessionId);
      }
    } catch (err) {
      console.error('Failed to transmit message', err);
      // Fallback message locally if network failed
      setTimeout(() => {
        setIsWaitingForReply(false);
        setMessages(prev => {
          const fallbackMsg: ChatMessage = {
            id: 'fallback-' + Date.now(),
            sender: 'agent',
            text: `[AI Assistant] Thank you for your inquiry regarding "${messageText.slice(0, 30)}...". Our engineering and consulting directors are reviewing your request and will follow up shortly. You can also reach us directly at info@sarohub.com or +92 3430381471.`,
            created_at: new Date().toISOString()
          };
          const updated = [...prev, fallbackMsg];
          saveConversationSummary(sessionId, updated);
          return updated;
        });
      }, 800);
    } finally {
      setIsSending(false);
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewUnread(false);
      fetchAgentStatus();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="sarohub-ai-chat-root">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[calc(100vh-100px)] rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-2xl flex flex-col mb-4 relative z-50 text-gray-900 font-sans"
          >
            {/* Top Bar Header - Matches SaroHub Website Navbar styling */}
            <div className="bg-white border-b border-gray-200 px-4 py-3.5 flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  {/* Status Indicator Dot */}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full border-2 border-white ${
                      agentStatus === 'online'
                        ? 'bg-emerald-500 shadow-2xs'
                        : agentStatus === 'away'
                        ? 'bg-amber-400'
                        : 'bg-gray-400'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold tracking-tight text-black truncate">
                      SaroHub Virtual Assistant
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black text-white font-bold uppercase tracking-wider">
                      AI
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                      <span className="text-gray-400">STATUS:</span>
                      <span
                        className={
                          agentStatus === 'online'
                            ? 'text-emerald-600 font-semibold'
                            : agentStatus === 'away'
                            ? 'text-amber-600 font-semibold'
                            : 'text-gray-500'
                        }
                      >
                        {agentStatus.toUpperCase()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {isRegistered && (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                    title="Delete / Clear entire conversation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all cursor-pointer disabled:opacity-50"
                  title="Synchronize session"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={toggleWidget}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                  title="Minimize"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conversation Selector / History Dropdown Bar */}
            {isRegistered && (
              <div
                className="bg-[#F8F9FA] border-b border-gray-200 px-4 py-2 flex items-center justify-between relative z-20 text-xs shrink-0"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-gray-700 hover:text-black font-mono text-[11px] py-1 px-2.5 rounded-lg bg-white border border-gray-200 hover:border-gray-400 transition-all cursor-pointer truncate max-w-[270px] shadow-2xs"
                >
                  <MessageSquare className="h-3 w-3 text-black shrink-0" />
                  <span className="truncate">
                    Session: {sessionId.slice(-6).toUpperCase()} ({messages.filter(m => m.sender !== 'system').length} msgs)
                  </span>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${showDropdown ? 'rotate-180 text-black' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleStartNewConversation}
                  className="flex items-center gap-1 text-[10px] font-mono text-black hover:bg-black hover:text-white bg-white border border-gray-300 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 font-semibold shadow-2xs"
                  title="Start a new conversation thread"
                >
                  <Plus className="h-3 w-3" /> New Chat
                </button>

                {/* Dropdown Menu for All Conversations */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="absolute top-full left-4 right-4 mt-1 bg-white border border-gray-200 rounded-2xl p-2 shadow-2xl z-30 max-h-64 overflow-y-auto space-y-1"
                    >
                      <div className="px-2 py-1 flex items-center justify-between border-b border-gray-100 pb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-semibold">Your Conversations</span>
                        <span className="text-[9px] font-mono text-black font-semibold">{conversationHistory.length} Recorded</span>
                      </div>

                      {conversationHistory.length === 0 ? (
                        <div className="p-3 text-center text-[11px] text-gray-500">Current thread is your only active conversation.</div>
                      ) : (
                        conversationHistory.map((conv) => {
                          const isCurrent = conv.id === sessionId;
                          return (
                            <div
                              key={conv.id}
                              onClick={() => handleSelectConversation(conv.id)}
                              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                                isCurrent
                                  ? 'bg-black text-white border-black shadow-xs'
                                  : 'bg-white border-gray-100 hover:border-gray-300 text-gray-800 hover:bg-gray-50'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`font-mono text-[10px] font-bold ${isCurrent ? 'text-gray-300' : 'text-gray-600'}`}>ID: {conv.id.slice(-6).toUpperCase()}</span>
                                  {isCurrent && (
                                    <span className="text-[8px] font-mono bg-white text-black px-1 rounded font-bold uppercase">Active</span>
                                  )}
                                  <span className={`text-[9px] font-mono flex items-center gap-0.5 ml-auto ${isCurrent ? 'text-gray-400' : 'text-gray-400'}`}>
                                    <Clock className="h-2.5 w-2.5" />
                                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className={`text-[11px] truncate mt-0.5 leading-snug ${isCurrent ? 'text-white' : 'text-gray-700'}`}>{conv.preview || 'Conversation thread'}</p>
                              </div>
                            </div>
                          );
                        })
                      )}

                      <div className="pt-1.5 border-t border-gray-100 mt-1 flex justify-between gap-2">
                        <button
                          type="button"
                          onClick={handleStartNewConversation}
                          className="w-full py-2 rounded-xl bg-black text-white font-bold text-[10px] font-mono uppercase tracking-wider hover:bg-gray-800 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Plus className="h-3 w-3" /> Start New Conversation
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Main Chat Messages Viewport (Container-bounded scroll, will NOT push website down) */}
            <div
              ref={chatScrollContainerRef}
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 bg-[#FBFBFB] flex flex-col scroll-smooth"
            >
              {!isRegistered ? (
                /* Registration Screen */
                <form onSubmit={handleRegister} className="my-auto space-y-4 px-2">
                  <div className="text-center space-y-2 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto shadow-md">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-bold text-black text-base -tracking-[0.3px]">Connect with Virtual Assistant</h4>
                    <p className="text-xs text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                      Enter your details to start a conversation with SaroHub's virtual assistant.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-1 font-semibold">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={e => setVisitorName(e.target.value)}
                        placeholder="Your Full Name"
                        className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-1 font-semibold">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={visitorPhone}
                        onChange={e => setVisitorPhone(e.target.value)}
                        placeholder="e.g. +92 343 0381473"
                        className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-1 font-semibold">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={visitorEmail}
                        onChange={e => setVisitorEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="w-full text-xs bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-all shadow-2xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-2 py-3 rounded-full bg-black text-white font-bold text-xs font-mono uppercase tracking-wider hover:bg-gray-800 transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" /> Begin Conversation
                    </button>
                  </div>
                </form>
              ) : (
                /* Chat Messages Screen with Explicit Blocks */
                <>
                  {messages.length === 0 ? (
                    <div className="my-auto text-center p-6 space-y-2">
                      <Bot className="h-8 w-8 text-gray-400 mx-auto opacity-70" />
                      <p className="text-xs text-gray-500">Virtual Assistant is ready. Ask anything about SaroHub software, pricing, or careers!</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {messages.map((m) => {
                        const isVisitor = m.sender === 'visitor';
                        const isSystem = m.sender === 'system';
                        const isAI = typeof m.text === 'string' && m.text.startsWith('[AI Assistant]');
                        const messageText = isAI ? m.text.replace('[AI Assistant]', '').trim() : m.text;

                        if (isSystem) {
                          return (
                            <div key={m.id} className="text-center py-1 shrink-0">
                              <span className="inline-block rounded-lg bg-gray-100 border border-gray-200 px-3 py-1 text-[10px] font-mono text-gray-600 leading-normal">
                                {m.text}
                              </span>
                            </div>
                          );
                        }

                        return (
                          /* Dedicated User & AI Message Blocks with Website Aesthetic */
                          <div
                            key={m.id}
                            className={`group relative rounded-2xl p-3.5 transition-all border shadow-xs ${
                              isVisitor
                                ? 'bg-black text-white border-black ml-6 rounded-tr-xs'
                                : 'bg-white text-gray-900 border-gray-200 mr-6 rounded-tl-xs'
                            }`}
                          >
                            {/* Block Header: Sender + Time + Copy + Delete Action */}
                            <div className={`flex items-center justify-between gap-2 border-b pb-1.5 mb-2 ${
                              isVisitor ? 'border-white/15' : 'border-gray-100'
                            }`}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                    isVisitor
                                      ? 'bg-white text-black shadow-2xs'
                                      : 'bg-black text-white'
                                  }`}
                                >
                                  {isVisitor ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                                </div>
                                <span className={`text-[11px] font-mono font-bold ${isVisitor ? 'text-white' : 'text-black'}`}>
                                  {isVisitor ? visitorName || 'You' : 'Virtual Assistant'}
                                </span>
                                {!isVisitor && isAI && (
                                  <span className="text-[8px] font-mono px-1 rounded bg-gray-100 text-gray-700 border border-gray-200 font-semibold">
                                    AI
                                  </span>
                                )}
                              </div>

                              {/* Message Block Actions (Copy + Delete single message) */}
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[9px] font-mono ${isVisitor ? 'text-gray-400' : 'text-gray-400'}`}>
                                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => handleCopyMessage(e, m.id, m.text)}
                                  className={`p-1 rounded transition-colors cursor-pointer ${
                                    isVisitor ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-black hover:bg-gray-100'
                                  }`}
                                  title="Copy message text"
                                >
                                  {copiedMessageId === m.id ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingMessageId === m.id}
                                  onClick={(e) => handleDeleteSingleMessage(e, m.id)}
                                  className={`p-1 rounded transition-colors cursor-pointer disabled:opacity-40 ${
                                    isVisitor ? 'text-gray-400 hover:text-rose-400 hover:bg-rose-950/40' : 'text-gray-400 hover:text-rose-600 hover:bg-rose-50'
                                  }`}
                                  title="Delete this message permanently"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Block Content Body */}
                            <div className={`text-xs leading-relaxed whitespace-pre-line break-words select-text font-sans ${
                              isVisitor ? 'text-gray-100' : 'text-gray-800'
                            }`}>
                              {messageText}
                            </div>
                          </div>
                        );
                      })}

                      {/* Typing indicator block */}
                      {isWaitingForReply && (
                        <div className="rounded-2xl p-3.5 bg-white border border-gray-200 mr-6 shadow-xs">
                          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100">
                            <div className="h-6 w-6 rounded-lg bg-black text-white flex items-center justify-center">
                              <Bot className="h-3.5 w-3.5 animate-spin-slow" />
                            </div>
                            <span className="text-[11px] font-mono font-bold text-black">Assistant is finding an answer...</span>
                          </div>
                          <div className="flex items-center gap-2 py-1">
                            <span className="text-xs text-gray-500">Processing inquiry</span>
                            <motion.span
                              className="inline-block h-1.5 w-1.5 rounded-full bg-black"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                            />
                            <motion.span
                              className="inline-block h-1.5 w-1.5 rounded-full bg-black"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.span
                              className="inline-block h-1.5 w-1.5 rounded-full bg-black"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Footer - Grounded and matching SaroHub styling */}
            {isRegistered && (
              <div className="border-t border-gray-200 bg-white p-3 shrink-0">
                {sessionClosed && (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-1.5 mb-2 text-center flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-gray-500">Previous ticket was resolved.</span>
                    <button
                      type="button"
                      onClick={handleStartNewConversation}
                      className="text-[10px] font-mono text-black hover:underline font-semibold cursor-pointer"
                    >
                      Start Fresh Thread
                    </button>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder="Ask anything about SaroHub..."
                      disabled={isSending}
                      className="w-full text-xs bg-[#FBFBFB] border border-gray-200 rounded-full pl-4 pr-10 py-2.5 text-black placeholder-gray-400 focus:outline-none focus:border-black focus:bg-white transition-all disabled:opacity-50 shadow-2xs"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="size-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all cursor-pointer shrink-0 shadow-xs"
                    title="Send Message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Clearing Entire Conversation */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
            role="presentation"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-[340px] rounded-3xl bg-white border border-gray-200 p-6 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-chat-title"
              onClick={event => event.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-rose-600 mb-2">
                <Trash2 className="h-5 w-5" />
                <h4 id="clear-chat-title" className="font-bold text-black text-base">Delete Entire Conversation?</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                This will permanently delete this whole conversation thread from the server and initialize a clean session.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 cursor-pointer shadow-xs"
                >
                  Delete / Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button matching Vaboulus Theme */}
      <button
        onClick={toggleWidget}
        className="relative h-14 w-14 rounded-full bg-gradient-to-r from-[#FF5C00] via-[#FF6C00] to-[#FF8526] text-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(255,92,0,0.55)] border border-[#FFA566]/40"
        aria-label="Open support portal"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6 text-white stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare className="h-6 w-6 text-white stroke-[2.2]" />
              {hasNewUnread && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF5C00] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FF5C00] border-2 border-white"></span>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
