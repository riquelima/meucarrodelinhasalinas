import { Home, Search, MessageCircle, User, LogOut, BookOpen, Shield, Calculator } from "lucide-react";
import { Logo } from "./Logo";
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
      }).catch(() => { });
    } catch { }
    return () => { cancelled = true; };
  }, [isOpen]);

  const accentByType = {
    passenger: { color: '#3b82f6', bg: 'bg-blue-600', glow: 'rgba(59,130,246,0.4)', activeText: 'text-blue-400', activeBg: 'bg-blue-600/15' },
    driver: { color: '#10b981', bg: 'bg-emerald-600', glow: 'rgba(16,185,129,0.4)', activeText: 'text-emerald-400', activeBg: 'bg-emerald-600/15' },
    advertiser: { color: '#a78bfa', bg: 'bg-purple-500', glow: 'rgba(167,139,250,0.4)', activeText: 'text-purple-400', activeBg: 'bg-purple-500/15' },
    admin: { color: '#ef4444', bg: 'bg-red-600', glow: 'rgba(239,68,68,0.4)', activeText: 'text-red-400', activeBg: 'bg-red-600/15' },
  };
  const accent = accentByType[userType];

  const roleLabel = {
    passenger: 'Passageiro',
    driver: 'Motorista',
    advertiser: 'Anunciante',
    admin: 'Administrador',
  }[userType];

  const adminMenuItems = [
    { id: 'dashboard', label: 'Painel Admin', icon: Shield },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const getSearchLabel = () => {
    if (userType === 'passenger') return 'Buscar Motoristas';
    if (userType === 'advertiser') return 'Campanhas';
    return 'Rotas';
  };

  const baseMenuItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    ...(userType !== 'driver' ? [{ id: 'search', label: getSearchLabel(), icon: Search }] : []),
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'chat', label: 'Mensagens', icon: MessageCircle },
  ];

  const regularMenuItems = userType === 'driver'
    ? [...baseMenuItems, { id: 'calculator', label: 'Calculadora de Corrida', icon: Calculator }, { id: 'profile', label: 'Perfil', icon: User }]
    : [...baseMenuItems, { id: 'profile', label: 'Perfil', icon: User }];

  const menuItems = userType === 'admin' ? adminMenuItems : regularMenuItems;

  const SidebarContent = () => (
    <div className="flex flex-col h-full sidebar-bg animate-slide-in-left">
      {/* Brand header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-md opacity-60"
              style={{ background: accent.glow }}
            />
            <Logo className={`w-11 h-11 relative z-10`} bgClass={accent.bg} />
          </div>
          <div>
            <h3
              className="gradient-text-static font-semibold text-sm leading-tight"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Meu Carro de Linha
            </h3>
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{
                background: `${accent.color}22`,
                color: accent.color,
                border: `1px solid ${accent.color}33`,
              }}
            >
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
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
              className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left animate-fade-in-up delay-${Math.min(index * 75, 400)} ${isActive
                  ? `${accent.activeBg} ${accent.activeText} font-medium`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                } ${isActive ? 'active' : ''}`}
              style={isActive ? { boxShadow: `inset 0 0 12px ${accent.glow}` } : {}}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
              {item.id === 'chat' && unreadMessages > 0 && (
                <span
                  className="ml-auto text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-badge-pop"
                  style={{ background: `linear-gradient(135deg, #3b82f6, #7c3aed)`, boxShadow: '0 2px 8px rgba(59,130,246,0.5)' }}
                >
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => {
            onLogout();
            setIsOpen(false);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-600/10 transition-all duration-200 text-sm"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 animate-fade-in"
          style={{ background: 'rgba(2,4,10,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={() => setIsOpen(false)}
        >
          <div className="w-72 h-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}

export function getUnreadMessages() {
  const val = Number(localStorage.getItem('unreadCount') || '0');
  return Number.isFinite(val) ? val : 0;
}