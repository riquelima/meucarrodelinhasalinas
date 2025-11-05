import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Send, Search, MoreVertical, ArrowLeft, Info } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useEffect, useMemo, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useChatSocket, ChatMessage } from "../hooks/useChatSocket";
import { fetchConversations, type Conversation } from "../services/chatApi";
import { fetchUserById, type User } from "../services/usersApi";

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
  const [contactInfo, setContactInfo] = useState<User | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

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
      try {
        const conv = await fetchConversations(myId, token);
        if (cancelled) return;
        setConversations(conv);
        if (startUserId) {
          const has = conv.some(c => c.id === startUserId);
          if (has) {
            setSelectedChat(startUserId);
            return;
          }
        }
        // Se nenhum selecionado, mostra a primeira conversa
        if (!selectedChat && !startUserId && conv.length > 0) {
          setSelectedChat(conv[0].id);
        }
      } catch (err) {
        console.error('Erro ao carregar conversas', err);
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
    });
    const offMsg = onMessageSent((msg) => {
      const fromId = typeof msg.from === 'string' ? msg.from : msg.from?._id;
      const toId = typeof msg.to === 'string' ? msg.to : msg.to?._id;
      if (!selectedChat || !myId) return;
      const isInChat = (fromId === selectedChat && toId === myId) || (fromId === myId && toId === selectedChat);
      if (isInChat) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    const offError = onError((e) => console.error('Socket error', e));
    return () => {
      offHistory?.();
      offMsg?.();
      offError?.();
    };
  }, [connected, onHistory, onMessageSent, onError, selectedChat, myId]);

  // Carrega historico de mensagens baseado no chat selecionado
  useEffect(() => {
    if (!connected || !selectedChat) return;
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

  const formatTime = (date?: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${hh}:${mm}`;
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

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load real contact info when dialog opens
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
    load();
  }, [showDriverInfo, selectedChat, token]);

  return (
    <div className="pt-16 bg-background h-screen flex flex-col">
      <Card className="shadow-sm flex flex-col lg:flex-row overflow-hidden bg-card border-border mx-0 lg:mx-8 mt-0 lg:mt-8 flex-1 h-[calc(100vh-4rem)] lg:h-[calc(100vh-8rem)]">
        {/* Conversations list - Hidden on mobile when chat is selected */}
        <div className={`w-full lg:w-80 border-b lg:border-r lg:border-b-0 border-border ${selectedChat ? 'hidden lg:block' : 'block'}`}>
          <div className="p-3 lg:p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <h2 className="text-foreground text-base lg:text-lg">Mensagens</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                className="pl-10 bg-input-background h-9 text-sm border-border"
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-200px)] lg:h-[calc(100%-8rem)]">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedChat(conv.id)}
                className={`w-full p-3 lg:p-4 flex items-start gap-3 hover:bg-accent transition-colors border-b border-border ${
                  selectedChat === conv.id ? 'bg-accent' : ''
                }`}
              >
                <Avatar className="w-10 h-10 lg:w-12 lg:h-12">
                  <ImageWithFallback
                    src={conv.photo}
                    alt={conv.name}
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className={getColor()}>
                    {conv.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-foreground truncate text-sm lg:text-base">{conv.name}</span>
                    <span className="text-muted-foreground text-xs">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-xs lg:text-sm truncate">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className={`${getColor()} text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2`}>
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>

        {/* Chat area */}
        <div className={`flex-1 min-h-0 flex flex-col ${selectedChat ? 'flex' : 'hidden lg:flex'}`}>
          {/* Chat header */}
          <div className="p-3 lg:p-4 border-b border-border flex items-center justify-between bg-card">
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
                <ImageWithFallback
                  src={currentChat?.photo || startUserAvatar || 'https://via.placeholder.com/150x150.png?text=Sem+Foto'}
                  alt={currentChat?.name || ''}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className={getColor()}>
                  {currentChat?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground text-sm lg:text-base truncate">
                  {currentChat?.name}
                </h3>
                <div className="flex items-center gap-2">
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
                    <ImageWithFallback
                      src={currentChat?.photo || startUserAvatar || 'https://via.placeholder.com/150x150.png?text=Sem+Foto'}
                      alt={currentChat?.name || ''}
                      className="w-full h-full object-cover"
                    />
                    <AvatarFallback className={getColor()}>
                      {currentChat?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-foreground">{currentChat?.name}</h3>
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
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avaliação:</span>
                    <span className="text-foreground">
                      {loadingInfo ? 'Carregando…' : (contactInfo?.avgRating ?? '-')}
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

          {/* Messages */}
          <ScrollArea className="flex-1 min-h-0 p-3 lg:p-4">
            <div className="space-y-3 lg:space-y-4">
              {messages.map((message) => {
                const fromId = typeof message.from === 'string' ? message.from : message.from?._id;
                const amISender = myId && fromId === myId;
                
                return (
                  <div
                    key={(message as any)._id || `${message.createdAt}-${Math.random()}`}
                    className={`flex gap-2 ${amISender ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-3 py-2 lg:px-4 ${
                        amISender ? `${getColor()} text-white` : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm lg:text-base">{message.content}</p>
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
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message input */}
          <div className="p-3 lg:p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                className="bg-input-background h-10 text-sm border-border"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (!selectedChat || !input.trim()) return;
                    try {
                      sendPrivateMessage(selectedChat, input.trim());
                      setInput("");
                    } catch (err) {
                      console.error('Erro ao enviar mensagem', err);
                    }
                  }
                }}
              />
              <Button
                className={`${getColor()} h-10 w-10 lg:w-auto lg:px-4`}
                onClick={() => {
                  if (!selectedChat || !input.trim()) return;
                  try {
                    sendPrivateMessage(selectedChat, input.trim());
                    setInput("");
                  } catch (err) {
                    console.error('Erro ao enviar mensagem', err);
                  }
                }}
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