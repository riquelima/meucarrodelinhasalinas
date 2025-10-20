import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Send, Search, MoreVertical, ArrowLeft, Info, X, AlertTriangle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface ChatScreenProps {
  userType: 'passenger' | 'driver' | 'advertiser' | 'admin';
}

export function ChatScreen({ userType }: ChatScreenProps) {
  const [selectedChat, setSelectedChat] = useState(1);
  const [showDriverInfo, setShowDriverInfo] = useState(false);
  const [showEndChat, setShowEndChat] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const conversations = [
    { 
      id: 1, 
      name: "Carlos Silva", 
      lastMessage: "Combinado! Até amanhã às 7h", 
      time: "10:30", 
      unread: 0,
      photo: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjA1OTM3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      status: "online"
    },
    { 
      id: 2, 
      name: "Maria Santos", 
      lastMessage: "Você pode pegar no ponto?", 
      time: "09:15", 
      unread: 2,
      photo: "https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MDYxODgxMHww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "online"
    },
    { 
      id: 3, 
      name: "João Oliveira", 
      lastMessage: "Obrigado pela carona!", 
      time: "Ontem", 
      unread: 0,
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc2MDY0NjI3MHww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "offline"
    },
    { 
      id: 4, 
      name: "Ana Costa", 
      lastMessage: "Qual o valor da rota?", 
      time: "Ontem", 
      unread: 1,
      photo: "https://images.unsplash.com/photo-1755889308931-7083dce2a345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRyaXZlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MDcyNTkwMnww&ixlib=rb-4.1.0&q=80&w=1080",
      status: "offline"
    },
  ];

  const messages = [
    { id: 1, sender: "other", text: "Oi! Você tem vaga para amanhã?", time: "10:20" },
    { id: 2, sender: "me", text: "Olá! Sim, tenho uma vaga disponível.", time: "10:22" },
    { id: 3, sender: "other", text: "Ótimo! Qual o horário de saída?", time: "10:23" },
    { id: 4, sender: "me", text: "Saio do Centro às 7h em ponto.", time: "10:25" },
    { id: 5, sender: "other", text: "Perfeito! Pode me pegar na Rua XV?", time: "10:28" },
    { id: 6, sender: "me", text: "Sim, sem problemas!", time: "10:29" },
    { id: 7, sender: "other", text: "Combinado! Até amanhã às 7h", time: "10:30" },
  ];

  const getColor = () => {
    switch (userType) {
      case 'passenger': return 'bg-blue-600';
      case 'driver': return 'bg-green-600';
      case 'advertiser': return 'bg-purple-400';
    }
  };

  const currentChat = conversations.find(c => c.id === selectedChat);

  return (
    <div className="pt-16 bg-background h-screen flex flex-col">
      <Card className="shadow-sm flex flex-col lg:flex-row overflow-hidden bg-card border-border mx-0 lg:mx-8 mt-0 lg:mt-8 flex-1 h-[calc(100vh-4rem)] lg:h-[calc(100vh-8rem)]">
        {/* Conversations list - Hidden on mobile when chat is selected */}
        <div className={`w-full lg:w-80 border-b lg:border-r lg:border-b-0 border-border ${selectedChat ? 'hidden lg:block' : 'block'}`}>
          <div className="p-3 lg:p-4 border-b border-border">
            <h2 className="text-foreground mb-3 lg:mb-4 text-base lg:text-lg">Mensagens</h2>
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
        <div className={`flex-1 flex flex-col ${selectedChat ? 'flex' : 'hidden lg:flex'}`}>
          {/* Chat header */}
          <div className="p-3 lg:p-4 border-b border-border flex items-center justify-between bg-card">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Button
                onClick={() => setSelectedChat(0)}
                variant="ghost"
                size="icon"
                className="lg:hidden h-9 w-9 flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Avatar className="w-10 h-10 flex-shrink-0">
                <ImageWithFallback
                  src={currentChat?.photo || ''}
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
                <DropdownMenuItem onClick={() => setShowEndChat(true)} className="cursor-pointer">
                  <X className="w-4 h-4 mr-2" />
                  Encerrar Conversa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowReport(true)} className="cursor-pointer text-red-500">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Denunciar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info Modal */}
          <Dialog open={showDriverInfo} onOpenChange={setShowDriverInfo}>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Informações {userType === 'driver' ? 'do Passageiro' : 'do Motorista'}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Visualize as informações detalhadas do contato
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <ImageWithFallback
                      src={currentChat?.photo || ''}
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
                    <span className="text-foreground">⭐ 4.8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Viagens:</span>
                    <span className="text-foreground">234</span>
                  </div>
                  {userType === 'passenger' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Veículo:</span>
                        <span className="text-foreground">Honda Civic Prata</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Placa:</span>
                        <span className="text-foreground">ABC-1234</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Membro desde:</span>
                    <span className="text-foreground">Janeiro 2023</span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* End Chat Modal */}
          <Dialog open={showEndChat} onOpenChange={setShowEndChat}>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground">Encerrar Conversa</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja encerrar esta conversa? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowEndChat(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => setShowEndChat(false)}>
                  Encerrar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Report Modal */}
          <Dialog open={showReport} onOpenChange={setShowReport}>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground">Denunciar Usuário</DialogTitle>
                <DialogDescription>
                  Descreva o motivo da denúncia. Nossa equipe irá analisar o caso.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm text-foreground">Motivo da Denúncia</label>
                  <select className="w-full h-10 bg-input-background border border-border rounded-md px-3 text-sm">
                    <option>Comportamento inadequado</option>
                    <option>Linguagem ofensiva</option>
                    <option>Spam ou fraude</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-foreground">Detalhes (opcional)</label>
                  <textarea 
                    className="w-full min-h-[100px] bg-input-background border border-border rounded-md px-3 py-2 text-sm resize-none"
                    placeholder="Descreva o que aconteceu..."
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowReport(false)}>
                  Cancelar
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => setShowReport(false)}>
                  Enviar Denúncia
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Messages */}
          <ScrollArea className="flex-1 p-3 lg:p-4">
            <div className="space-y-3 lg:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] lg:max-w-[70%] rounded-2xl px-3 py-2 lg:px-4 ${
                      message.sender === 'me'
                        ? `${getColor()} text-white`
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm lg:text-base">{message.text}</p>
                    <span
                      className={`text-xs mt-1 block ${
                        message.sender === 'me' ? 'text-white/80' : 'text-muted-foreground'
                      }`}
                    >
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message input */}
          <div className="p-3 lg:p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                className="bg-input-background h-10 text-sm border-border"
              />
              <Button className={`${getColor()} h-10 w-10 lg:w-auto lg:px-4`}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}