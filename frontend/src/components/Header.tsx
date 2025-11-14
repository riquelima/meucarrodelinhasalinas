import { Menu, X, Car, Sun, Moon, LogIn } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useState, useEffect } from "react";

interface HeaderProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
  unreadMessages: number;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  onNavigate: (screen: string) => void;
  showMenuButton?: boolean;
  showLoginButton?: boolean;
}

export function Header({ onMenuClick, isMenuOpen, unreadMessages, theme, onThemeChange, onNavigate, showMenuButton = true, showLoginButton = false }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate('dashboard')}
        >
          <Logo className="w-10 h-10" />
          <div>
            <h1 className="text-foreground">Meu Carro de Linha</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            {showMenuButton && (
              <Button
                onClick={onMenuClick}
                variant="outline"
                size="icon"
                className="bg-card shadow-md border-border"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            )}

            {!showMenuButton && showLoginButton && (
              <Button
                onClick={() => onNavigate('login')}
                variant="outline"
                className="bg-card shadow-md border-border flex items-center gap-2 px-3 py-1.5"
                aria-label="Entrar"
                title="Entrar"
              >
                <LogIn className="w-5 h-5" />
                <span>Entrar</span>
              </Button>
            )}
            {unreadMessages > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white text-xs">
                {unreadMessages}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
