import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Send, Search, MoreVertical, ArrowLeft, Info, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { useChatSocket, ChatMessage } from "../hooks/useChatSocket";
import { fetchConversations, type Conversation } from "../services/chatApi";
import { fetchUserById, type User } from "../services/usersApi";
import { createReview } from "../services/reviewsApi";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";

interface ChatScreenProps {
  userType: 'passenger' | 'driver' | 'advertiser' | 'admin';
  startUserId?: string;
  startUserName?: string;
  startUserAvatar?: string;
  onStartChatConsumed?: () => void;
}

export function ChatScreen({ userType, startUserId, startUserName, startUserAvatar, onStartChatConsumed }: ChatScreenProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showDriverInfo, setShowDriverInfo] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [contactInfo, setContactInfo] = useState<User | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const hasScrolledToBottomRef = useRef(false);
  const lastMessageCountRef = useRef(0);
  const shouldAutoScrollRef = useRef(true);
  const isUserScrollingRef = useRef(false);

  const token = useMemo(() => localStorage.getItem('token') || undefined, []);
  const myId = useMemo(() => {
    if (!token) return undefined as string | undefined;
    try {
      const decoded: any = jwtDecode(token);
      return decoded?.sub as string | undefined;
    } catch {
      return undefined;
    }
  }, [token]);

  const { connected, sendPrivateMessage, requestHistory, onHistory, onMessageSent, onError } = useChatSocket(token);

  // Carrega conversas do usuario
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!myId || !token) return;
      setIsLoading(true);
      try {
        const conv = await fetchConversations(myId, token);
        if (cancelled) return;
        setConversations(conv);
        if (startUserId) {
          const has = conv.some(c => c.id === startUserId);
          if (has) {
            setSelectedChat(startUserId);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar conversas', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [myId, token, startUserId]);

  // Socket: escuta novas mensagens e historico
  useEffect(() => {
    if (!connected) return;
    const offHistory = onHistory((msgs) => {
      const sorted = [...msgs].sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
      setMessages(sorted);
      lastMessageCountRef.current = sorted.length;
      setShouldAutoScroll(false);
      shouldAutoScrollRef.current = false;
      
      if (!hasScrolledToBottomRef.current) {
        requestAnimationFrame(() => {
          if (messagesContainerRef.current) {
            const container = messagesContainerRef.current;
            container.scrollTop = container.scrollHeight;
            hasScrolledToBottomRef.current = true;
          }
        });
      }
    });
    const offMsg = onMessageSent((msg) => {
      const fromId = typeof msg.from === 'string' ? msg.from : msg.from?._id;
      const toId = typeof msg.to === 'string' ? msg.to : msg.to?._id;
      if (!myId) return;
      
      const otherUserId = fromId === myId ? toId : fromId;
      const isInChat = selectedChat && ((fromId === selectedChat && toId === myId) || (fromId === myId && toId === selectedChat));
      
      if (isInChat) {
        setMessages((prev) => {
          const msgId = typeof msg.from === 'string' ? msg.from : msg.from?._id;
          const msgTime = new Date(msg.createdAt || 0).getTime();
          
          const exists = prev.some(m => {
            const mId = typeof m.from === 'string' ? m.from : m.from?._id;
            if (mId !== msgId || m.content !== msg.content) return false;
            const mTime = new Date(m.createdAt || 0).getTime();
            return Math.abs(mTime - msgTime) < 2000;
          });
          
          if (exists) {
            const filtered = prev.filter(m => !m._id?.startsWith('temp-') || m.content !== msg.content);
            return filtered;
          }
          
          const filtered = prev.filter(m => !m._id?.startsWith('temp-') || m.content !== msg.content);
          const newMessages = [...filtered, msg];
          lastMessageCountRef.current = newMessages.length;
          
          requestAnimationFrame(() => {
            if (messagesContainerRef.current && !isUserScrollingRef.current) {
              const container = messagesContainerRef.current;
              const { scrollHeight, clientHeight, scrollTop } = container;
              if (scrollHeight - scrollTop - clientHeight < 150) {
                container.scrollTop = scrollHeight - clientHeight;
              }
            }
          });
          
          return newMessages;
        });
      }
      
      if (otherUserId) {
        setConversations((prev) => {
          const messagePreview = msg.content.length > 50 
            ? msg.content.substring(0, 50) + '...' 
            : msg.content;
          
          const existingIndex = prev.findIndex(c => c.id === otherUserId);
          
          if (existingIndex !== -1) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              lastMessage: fromId === myId ? `Você: ${messagePreview}` : messagePreview,
              time: formatTime(msg.createdAt),
              unread: fromId === myId ? (selectedChat === otherUserId ? 0 : updated[existingIndex].unread) : (selectedChat === otherUserId ? 0 : updated[existingIndex].unread + 1),
            };
            
            if (existingIndex > 0) {
              const [moved] = updated.splice(existingIndex, 1);
              return [moved, ...updated];
            }
            
            return updated;
          }
          
          const fromUser = typeof msg.from === 'object' ? msg.from : null;
          const toUser = typeof msg.to === 'object' ? msg.to : null;
          const otherUser = fromId === myId ? toUser : fromUser;
          
          const newConv: Conversation = {
            id: otherUserId,
            name: otherUser?.name || 'Usuário',
            lastMessage: fromId === myId ? `Você: ${msg.content}` : msg.content,
            time: formatTime(msg.createdAt),
            unread: fromId === myId ? 0 : (selectedChat === otherUserId ? 0 : 1),
            photo: otherUser?.avatar || '',
            status: 'offline',
          };
          
          return [newConv, ...prev];
        });
      }
    });
    const offError = onError((e) => console.error('Socket error', e));
    return () => {
      offHistory?.();
      offMsg?.();
      offError?.();
    };
  }, [connected, onHistory, onMessageSent, onError, selectedChat, myId]);

  useEffect(() => {
    if (!connected || !selectedChat) return;
    setShouldAutoScroll(false);
    setIsUserScrolling(false);
    hasScrolledToBottomRef.current = false;
    shouldAutoScrollRef.current = false;
    isUserScrollingRef.current = false;
    try {
      requestHistory({ withUserId: selectedChat, limit: 50 });
    } catch (err) {
      console.error('Falha ao solicitar histórico', err);
    }
  }, [connected, selectedChat, requestHistory]);

  const getColor = () => {
    switch (userType) {
      case 'passenger': return 'bg-blue-600';
      case 'driver': return 'bg-green-600';
      case 'advertiser': return 'bg-purple-400';
    }
  };

  const currentChat = useMemo(() => {
    const chat = conversations.find(c => c.id === selectedChat);
    // Update status based on latest message if available
    if (chat && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const otherUser = typeof lastMsg.from === 'object' && lastMsg.from._id !== myId ? lastMsg.from : 
                        typeof lastMsg.to === 'object' && lastMsg.to._id !== myId ? lastMsg.to : null;
      if (otherUser && otherUser.status) {
        return { ...chat, status: otherUser.status as 'online' | 'offline' };
      }
    }
    return chat;
  }, [conversations, selectedChat, messages, myId]);

  const formatTime = useCallback((date?: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
  }, []);

  const formatMessageDate = useCallback((date?: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const messageDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    if (messageDate.getTime() === today.getTime()) {
      return 'Hoje';
    } else if (messageDate.getTime() === yesterday.getTime()) {
      return 'Ontem';
    } else {
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  }, []);

  const shouldShowDateSeparator = useCallback((currentMsg: ChatMessage, prevMsg: ChatMessage | null) => {
    if (!prevMsg) return true;
    const currentDate = currentMsg.createdAt ? new Date(currentMsg.createdAt).toDateString() : '';
    const prevDate = prevMsg.createdAt ? new Date(prevMsg.createdAt).toDateString() : '';
    return currentDate !== prevDate;
  }, []);

  const isDriver = (user: User | null) => {
    if (!user) return false;
    const role = Array.isArray(user.role) ? user.role[0] : user.role;
    return role === 'motorista' || role === 'driver';
  };

  const handleSubmitReview = async () => {
    if (!selectedChat || !myId || !token || reviewRating === 0 || !reviewContent.trim()) {
      toast.error('Preencha todos os campos');
      return;
    }

    setIsSubmittingReview(true);
    try {
      await createReview({
        reviewerId: myId,
        receiverId: selectedChat,
        rating: reviewRating,
        content: reviewContent.trim(),
      }, token);

      toast.success('Avaliação enviada com sucesso!');
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewContent("");
      
      const data = await fetchUserById(selectedChat, token);
      setContactInfo(data);
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar avaliação');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedChat || !content.trim() || !myId) return;
    
    const messageContent = content.trim();
    setInput("");
    
    const optimisticMessage: ChatMessage = {
      _id: `temp-${Date.now()}`,
      from: myId,
      to: selectedChat,
      content: messageContent,
      isRead: false,
      createdAt: new Date(),
    };
    
    setMessages((prev) => [...prev, optimisticMessage]);
    
    requestAnimationFrame(() => {
      if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        container.scrollTop = container.scrollHeight;
      }
    });
    
    setConversations((prev) => {
      const messagePreview = messageContent.length > 50 
        ? messageContent.substring(0, 50) + '...' 
        : messageContent;
      
      const existingIndex = prev.findIndex(c => c.id === selectedChat);
      
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          lastMessage: `Você: ${messagePreview}`,
          time: formatTime(new Date()),
          unread: updated[existingIndex].unread,
        };
        
        if (existingIndex > 0) {
          const [moved] = updated.splice(existingIndex, 1);
          return [moved, ...updated];
        }
        
        return updated;
      }
      
      return prev;
    });
    
    try {
      sendPrivateMessage(selectedChat, messageContent);
    } catch (err) {
      console.error('Erro ao enviar mensagem', err);
      setMessages((prev) => prev.filter(m => m._id !== optimisticMessage._id));
    }
  };

  const handleStartNewChat = (userId: string, userName: string, userAvatar?: string) => {
    //Validar se ja existe essa conversa
    const existingConv = conversations.find(c => c.id === userId);
    if (existingConv) {
      setSelectedChat(userId);
      return;
    }

    // Cria uma mensagem temporaria caso seja a primeira entre usuarios
    const newConv: Conversation = {
      id: userId,
      name: userName,
      lastMessage: "",
      time: "",
      unread: 0,
      photo: userAvatar || 'https://via.placeholder.com/150x150.png?text=Sem+Foto',
      status: 'offline',
    };

    setConversations(prev => [newConv, ...prev]);
    setSelectedChat(userId);
    setMessages([]);
  };

  // If App requested to start chat with a specific user, handle it here
  useEffect(() => {
    if (startUserId) {
      // Try to find name from existing conversations if not provided
      const existing = conversations.find(c => c.id === startUserId);
      const name = startUserName || existing?.name || 'Usuário';
      const avatar = startUserAvatar || existing?.photo;
      handleStartNewChat(startUserId, name, avatar);
      onStartChatConsumed?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startUserId]);

  useEffect(() => {
    let wasHidden = false;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        wasHidden = true;
      } else if (wasHidden) {
        setSelectedChat(null);
        wasHidden = false;
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!startUserId) {
      setSelectedChat(null);
    }
  }, [startUserId]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    let lastScrollTop = container.scrollTop;

    const handleScroll = () => {
      const currentScrollTop = container.scrollTop;
      const { scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - currentScrollTop - clientHeight < 100;
      const isScrollingUp = currentScrollTop < lastScrollTop;

      setIsUserScrolling(true);
      setShouldAutoScroll(isNearBottom && !isScrollingUp);
      isUserScrollingRef.current = true;
      shouldAutoScrollRef.current = isNearBottom && !isScrollingUp;

      lastScrollTop = currentScrollTop;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsUserScrolling(false);
        isUserScrollingRef.current = false;
      }, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [selectedChat]);


  // Load real contact info when chat is selected
  useEffect(() => {
    const load = async () => {
      if (!selectedChat || !token) return;
      try {
        const data = await fetchUserById(selectedChat, token);
        setContactInfo(data);
      } catch (e) {
        console.error('Falha ao carregar informações do contato', e);
      }
    };
    load();
  }, [selectedChat, token]);

  // Load contact info when dialog opens (refresh)
  useEffect(() => {
    const load = async () => {
      if (!showDriverInfo || !selectedChat || !token) return;
      try {
        setLoadingInfo(true);
        const data = await fetchUserById(selectedChat, token);
        setContactInfo(data);
      } catch (e) {
        console.error('Falha ao carregar informações do contato', e);
      } finally {
        setLoadingInfo(false);
      }
    };
    if (showDriverInfo) {
      load();
    }
  }, [showDriverInfo, selectedChat, token]);

  if (isLoading) {
    return (
      <div className="pt-16 bg-background h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Carregando conversas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 bg-background h-screen flex flex-col">
      <Card className="shadow-sm flex flex-col lg:flex-row overflow-hidden bg-card border-border mx-0 lg:mx-8 mt-0 lg:mt-8 flex-1 h-[calc(100vh-4rem)] lg:h-[calc(100vh-8rem)]">
        {/* Conversations list - Hidden on mobile when chat is selected */}
        <div className={`w-full lg:w-80 border-b lg:border-r lg:border-b-0 border-border flex flex-col ${selectedChat ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-3 lg:p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h2 className="text-foreground text-base lg:text-lg font-semibold">Mensagens</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                className="pl-10 bg-input-background h-9 text-sm border-border"
              />
            </div>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <ScrollArea className="flex-1">
              <div className="pb-2">
                {conversations.length === 0 ? (
                  <div className="flex items-center justify-center p-8 text-muted-foreground text-sm">
                    Nenhuma conversa ainda
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedChat(conv.id)}
                      className={`w-full p-3 lg:p-4 flex items-start gap-3 hover:bg-accent transition-colors border-b border-border ${
                        selectedChat === conv.id ? 'bg-accent' : ''
                      }`}
                    >
                      <Avatar className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0">
                        {conv.photo && conv.photo !== 'https://via.placeholder.com/150x150.png?text=Sem+Foto' ? (
                          <ImageWithFallback
                            src={conv.photo}
                            alt={conv.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                        <AvatarFallback className={getColor()}>
                          {conv.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left overflow-hidden min-w-0">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className="text-foreground truncate text-sm lg:text-base font-medium">{conv.name}</span>
                          <span className="text-muted-foreground text-xs flex-shrink-0">{conv.time}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-muted-foreground text-xs lg:text-sm truncate">{conv.lastMessage || 'Nenhuma mensagem'}</p>
                          {conv.unread > 0 && (
                            <span className={`${getColor()} text-white text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center flex-shrink-0 ${conv.unread > 9 ? 'px-1.5' : 'px-0 w-5'}`}>
                              {conv.unread > 99 ? '99+' : conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Chat area */}
        <div className={`flex-1 min-h-0 flex flex-col overflow-hidden ${selectedChat ? 'flex' : 'hidden lg:flex'}`}>
          {/* Chat header - Fixed */}
          <div className="p-3 lg:p-4 border-b border-border flex items-center justify-between bg-card flex-shrink-0 z-10">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                onClick={() => setSelectedChat(null)}
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Avatar className="w-10 h-10 flex-shrink-0">
                {contactInfo?.avatar ? (
                  <ImageWithFallback
                    src={contactInfo.avatar}
                    alt={currentChat?.name || ''}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <AvatarFallback className={getColor()}>
                    {currentChat?.name.charAt(0)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground text-sm lg:text-base font-semibold truncate">
                  {currentChat?.name || 'Usuário'}
                </h3>
                {contactInfo && isDriver(contactInfo) && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs border-0 ${
                        currentChat?.status === 'online' 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-gray-600/20 text-gray-400'
                      }`}
                    >
                      {currentChat?.status === 'online' ? 'Online' : 'Offline'}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 flex-shrink-0">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border">
                <DropdownMenuItem onClick={() => setShowDriverInfo(true)} className="cursor-pointer">
                  <Info className="w-4 h-4 mr-2" />
                  Ver Informações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowReviewModal(true)} className="cursor-pointer">
                  <Star className="w-4 h-4 mr-2" />
                  Avaliar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info Modal (real data) */}
          <Dialog open={showDriverInfo} onOpenChange={setShowDriverInfo}>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Informações do Contato
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Visualize as informações detalhadas do contato
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    {contactInfo?.avatar ? (
                      <ImageWithFallback
                        src={contactInfo.avatar}
                        alt={currentChat?.name || ''}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <AvatarFallback className={getColor()}>
                      {(currentChat?.name || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-foreground font-semibold">{currentChat?.name || 'Usuário'}</h3>
                    {contactInfo && isDriver(contactInfo) && (
                      <Badge 
                        variant="secondary" 
                        className={`text-xs border-0 mt-1 ${
                          currentChat?.status === 'online' 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {currentChat?.status === 'online' ? 'Online' : 'Offline'}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avaliação:</span>
                    <span className="text-foreground">
                      {loadingInfo ? 'Carregando…' : (contactInfo?.avgRating ? contactInfo.avgRating.toFixed(1) : '-')}
                    </span>
                  </div>
                  {contactInfo && (
                    <>
                      {contactInfo.vehicle && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Veículo:</span>
                          <span className="text-foreground">{contactInfo.vehicle}</span>
                        </div>
                      )}
                      {contactInfo.carColor && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cor:</span>
                          <span className="text-foreground">{contactInfo.carColor}</span>
                        </div>
                      )}
                      {contactInfo.licensePlate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Placa:</span>
                          <span className="text-foreground">{contactInfo.licensePlate}</span>
                        </div>
                      )}
                      {contactInfo.origin && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Origem:</span>
                          <span className="text-foreground">{contactInfo.origin}</span>
                        </div>
                      )}
                      {contactInfo.destination && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Destino:</span>
                          <span className="text-foreground">{contactInfo.destination}</span>
                        </div>
                      )}
                      {typeof contactInfo.seatsAvailable === 'number' && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vagas:</span>
                          <span className="text-foreground">{contactInfo.seatsAvailable}</span>
                        </div>
                      )}
                      {contactInfo.availableDays && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dias disponíveis:</span>
                          <span className="text-foreground">{contactInfo.availableDays}</span>
                        </div>
                      )}
                      {contactInfo.number && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Telefone:</span>
                          <span className="text-foreground">{contactInfo.number}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Membro desde:</span>
                    <span className="text-foreground">
                      {contactInfo?.createdAt ? new Date(contactInfo.createdAt).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' }) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Review Modal */}
          <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Avaliar {currentChat?.name || 'Usuário'}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Avalie o usuário com uma nota de 1 a 5 estrelas e um comentário
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label className="text-foreground mb-2 block">Avaliação</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="reviewContent" className="text-foreground mb-2 block">
                    Comentário
                  </Label>
                  <Textarea
                    id="reviewContent"
                    placeholder="Deixe um comentário sobre sua experiência..."
                    className="bg-input-background text-foreground border-border min-h-[100px]"
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowReviewModal(false);
                      setReviewRating(0);
                      setReviewContent("");
                    }}
                    disabled={isSubmittingReview}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview || reviewRating === 0 || !reviewContent.trim()}
                    className={getColor()}
                  >
                    {isSubmittingReview ? 'Enviando...' : 'Enviar Avaliação'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Messages - Scrollable area */}
          <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            <div className="p-3 lg:p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center min-h-[200px] text-muted-foreground text-sm">
                    Nenhuma mensagem ainda. Comece a conversar!
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const fromId = typeof message.from === 'string' ? message.from : message.from?._id;
                    const amISender = myId && fromId === myId;
                    const prevMessage = index > 0 ? messages[index - 1] : null;
                    const showDateSeparator = shouldShowDateSeparator(message, prevMessage);
                    
                    return (
                      <div key={(message as any)._id || `${message.createdAt}-${Math.random()}`}>
                        {showDateSeparator && (
                          <div className="flex items-center justify-center my-4">
                            <div className="px-3 py-1 bg-muted/50 rounded-full">
                              <span className="text-xs text-muted-foreground font-medium">
                                {formatMessageDate(message.createdAt)}
                              </span>
                            </div>
                          </div>
                        )}
                        <div className={`flex gap-2 ${amISender ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-3 py-2 lg:px-4 ${
                              amISender ? `${getColor()} text-white` : 'bg-muted text-foreground'
                            }`}
                          >
                            <p className="text-sm lg:text-base break-words">{message.content}</p>
                            <div className={`flex items-center gap-2 mt-1 ${amISender ? 'justify-end' : 'justify-start'}`}>
                              <span
                                className={`text-xs ${
                                  amISender ? 'text-white/80' : 'text-muted-foreground'
                                }`}
                              >
                                {formatTime(message.createdAt)}
                              </span>
                              {amISender && (
                                <span className="text-xs text-white/80">
                                  {message.isRead ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} style={{ scrollMargin: 0 }} />
            </div>
          </div>

          {/* Message input - Fixed */}
          <div className="p-3 lg:p-4 border-t border-border flex-shrink-0 bg-card">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                className="bg-input-background h-10 text-sm border-border"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(input);
                  }
                }}
              />
              <Button
                className={`${getColor()} h-10 w-10 lg:w-auto lg:px-4`}
                onClick={() => handleSendMessage(input)}
                disabled={!connected}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}