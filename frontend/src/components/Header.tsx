import { Menu, X, Car, Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { useState, useEffect } from "react";

interface HeaderProps {
  onMenuClick: () => void;
  isMenuOpen: boolean;
  unreadMessages: number;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function Header({ onMenuClick, isMenuOpen, unreadMessages, theme, onThemeChange }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        // Scrolling up or near top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-foreground">Meu Carro de Linha</h1>
            <p className="text-muted-foreground text-xs hidden sm:block">Salinas</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg border border-border">
            <Sun className="w-4 h-4 text-muted-foreground" />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => onThemeChange(checked ? 'dark' : 'light')}
            />
            <Moon className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="relative">
            <Button
              onClick={onMenuClick}
              variant="outline"
              size="icon"
              className="bg-card shadow-md border-border"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
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
