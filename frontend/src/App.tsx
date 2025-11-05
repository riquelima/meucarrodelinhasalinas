import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { WelcomeDialog } from './components/WelcomeDialog';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { PassengerDashboard } from './components/PassengerDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { AdvertiserDashboard } from './components/AdvertiserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { BlogScreen } from './components/BlogScreen';
import { ChatScreen } from './components/ChatScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { RideCalculatorScreen } from './components/RideCalculatorScreen';

import SignupSuccessPage  from './sucess';
import Loading from './loading';
import { Toaster } from './components/ui/sonner';

type UserType = 'passenger' | 'driver' | 'advertiser' | 'admin' | null;
type Screen =
  | 'login'
  | 'signup'
  | 'signup-success'
  | 'forgot-password'
  | 'dashboard'
  | 'search'
  | 'chat'
  | 'profile'
  | 'blog'
  | 'calculator';
type Theme = 'light' | 'dark';

interface JwtPayload {
  role: 'passageiro' | 'motorista' | 'anunciante' | 'admin';
  name?: string;
  email?: string;
  [key: string]: any;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userType, setUserType] = useState<UserType>(null);
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'dark';
  });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [pendingChat, setPendingChat] = useState<{ id?: string; name?: string; avatar?: string } | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Tema
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Carregar usuário do token JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoadingUser(false);
      return;
    }

    try {
      const decoded: JwtPayload & { exp?: number } = jwtDecode(token);

      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        console.warn('Token expirado');
        localStorage.removeItem('token');
        setIsLoadingUser(false);
        setUserType(null);
        setUser(null);
        setCurrentScreen('login');
        return;
      }

      let type: UserType = null;
      if (decoded.role === 'motorista') type = 'driver';
      else if (decoded.role === 'passageiro') type = 'passenger';
      else if (decoded.role === 'anunciante') type = 'advertiser';
      else if (decoded.role === 'admin') type = 'admin';

      setUserType(type);
      setUser(decoded);
      setCurrentScreen('dashboard');
    } catch (err) {
      console.error('Token inválido:', err);
      localStorage.removeItem('token');
      setUserType(null);
      setUser(null);
      setCurrentScreen('login');
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  // Login
  const handleLogin = (type: 'passenger' | 'driver' | 'advertiser' | 'admin', token?: string) => {
    if (token) localStorage.setItem('token', token);
    setUserType(type);
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    }
    setCurrentScreen('dashboard');
  };

  // Signup
  const handleSignup = (type: 'passenger' | 'driver' | 'advertiser' | 'admin') => {
    setUserType(type);
    setCurrentScreen('dashboard');
    setShowWelcome(true);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserType(null);
    setUser(null);
    setCurrentScreen('login');
  };

  const handleNavigate = (screen: string) => setCurrentScreen(screen as Screen);

  // Inicia chat por outra tela
  const handleStartChat = (id: string, name: string, avatar?: string) => {
    setPendingChat({ id, name, avatar });
    setCurrentScreen('chat');
  };

  if (isLoadingUser) {
    return <Loading />;
  }

  // Telas públicas
  if (currentScreen === 'login') return <LoginScreen onNavigate={handleNavigate} onLogin={handleLogin} />;
  if (currentScreen === 'signup') return <SignupScreen onNavigate={handleNavigate} />;

  if (currentScreen === 'signup-success') {
    return (
      <SignupSuccessPage
        onLogin={() => setCurrentScreen('login')}
      />
    );
  }
  
  if (currentScreen === 'forgot-password') return <ForgotPasswordScreen onNavigate={handleNavigate} />;

  if (!userType) return null;

  // Telas privadas
  return (
    <div className="min-h-screen bg-background">
      {userType && (
        <WelcomeDialog
          isOpen={showWelcome}
          onClose={() => setShowWelcome(false)}
          userType={userType}
        />
      )}
      <Header
        onMenuClick={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
        unreadMessages={unreadCount}
        theme={theme}
        onThemeChange={setTheme}
        onNavigate={handleNavigate}
      />
      <Sidebar
        userType={userType}
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        onUnreadChange={(c) => {
          setUnreadCount(c);
          try { localStorage.setItem('unreadCount', String(c)); } catch {}
        }}
      />
      <div className="w-full">
        {currentScreen === 'dashboard' && userType === 'admin' && <AdminDashboard />}
        {currentScreen === 'dashboard' && userType !== 'admin' && (
          <HomeDashboard onNavigate={handleNavigate} userType={userType} onStartChat={handleStartChat} />
        )}
        {currentScreen === 'search' && userType === 'passenger' && <PassengerDashboard onNavigate={handleNavigate} />}
        {currentScreen === 'search' && userType === 'advertiser' && (
          <AdvertiserDashboard onNavigate={handleNavigate} userId={(user as any)?.sub} />
        )}
        {currentScreen === 'blog' && <BlogScreen />}
        {currentScreen === 'chat' && userType !== 'admin' && (
          <ChatScreen
            userType={userType}
            startUserId={pendingChat?.id}
            startUserName={pendingChat?.name}
            startUserAvatar={pendingChat?.avatar}
            onStartChatConsumed={() => setPendingChat(null)}
          />
        )}
        {currentScreen === 'calculator' && <RideCalculatorScreen userType={userType} />}
        {currentScreen === 'profile' && <ProfileScreen onLogout={handleLogout} theme={theme} onThemeChange={setTheme} />}
      </div>
      <Toaster />
    </div>
  );
}
