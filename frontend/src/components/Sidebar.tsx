import { Home, Search, MessageCircle, User, Car, LogOut, BookOpen, Shield, Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { fetchUnreadCount } from "../services/chatApi";

interface SidebarProps {
  userType: 'passenger' | 'driver' | 'advertiser' | 'admin';
  currentScreen: string;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUnreadChange?: (count: number) => void;
}

export function Sidebar({ userType, currentScreen, onNavigate, onLogout, isOpen, setIsOpen, onUnreadChange }: SidebarProps) {
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  // Fetch unread count from backend
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    let cancelled = false;
    try {
      const decoded: any = jwtDecode(token);
      const myId = decoded?.sub as string | undefined;
      if (!myId) return;
      fetchUnreadCount(myId, token).then((count) => {
        if (cancelled) return;
        setUnreadMessages(count);
        onUnreadChange?.(count);
      }).catch(() => {});
    } catch {}
    return () => { cancelled = true; };
  }, [isOpen]);

  const getColor = () => {
    switch (userType) {
      case 'passenger': return 'bg-blue-600';
      case 'driver': return 'bg-green-600';
      case 'advertiser': return 'bg-purple-400';
      case 'admin': return 'bg-red-600';
    }
  };

  const getColorHover = () => {
    switch (userType) {
      case 'passenger': return 'hover:bg-blue-50/10';
      case 'driver': return 'hover:bg-green-50/10';
      case 'advertiser': return 'hover:bg-purple-50/10';
      case 'admin': return 'hover:bg-red-50/10';
    }
  };

  const getColorActive = () => {
    switch (userType) {
      case 'passenger': return 'bg-blue-600/20 text-blue-400';
      case 'driver': return 'bg-green-600/20 text-green-400';
      case 'advertiser': return 'bg-purple-400/20 text-purple-400';
      case 'admin': return 'bg-red-600/20 text-red-400';
    }
  };

  const adminMenuItems = [
    { id: 'dashboard', label: 'Painel Admin', icon: Shield },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const getSearchLabel = () => {
    if (userType === 'passenger') return 'Buscar Motoristas';
    if (userType === 'driver') return 'Solicitações';
    if (userType === 'advertiser') return 'Campanhas';
    return 'Rotas';
  };

  const baseMenuItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    ...(userType !== 'driver' ? [{ id: 'search', label: getSearchLabel(), icon: Search }] : []),
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'chat', label: 'Mensagens', icon: MessageCircle },
  ];

  const calculatorItem = { id: 'calculator', label: 'Calculadora de Corrida', icon: Calculator };
  const profileItem = { id: 'profile', label: 'Perfil', icon: User };

  const regularMenuItems = userType === 'driver' 
    ? [...baseMenuItems, calculatorItem, profileItem]
    : [...baseMenuItems, profileItem];

  const menuItems = userType === 'admin' ? adminMenuItems : regularMenuItems;

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${getColor()} rounded-xl flex items-center justify-center`}>
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-foreground">Meu Carro de Linha</h3>
            <p className="text-muted-foreground text-sm">
              {userType === 'passenger' ? 'Passageiro' : userType === 'driver' ? 'Motorista' : userType === 'advertiser' ? 'Anunciante' : 'Administrador'}
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
                if (item.id === 'chat') {
                  setUnreadMessages(0);
                  onUnreadChange?.(0);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? getColorActive() : `text-foreground ${getColorHover()}`
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.id === 'chat' && unreadMessages > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <Button
          onClick={() => {
            onLogout();
            setIsOpen(false);
          }}
          variant="ghost"
          className="w-full justify-start text-foreground hover:bg-red-600/20 hover:text-red-400"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Sidebar overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)}>
          <div
            className="w-72 h-full bg-card flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}

export function getUnreadMessages() {
  // Legacy helper (kept for compatibility). Prefer lifting state in App.
  const val = Number(localStorage.getItem('unreadCount') || '0');
  return Number.isFinite(val) ? val : 0;
}