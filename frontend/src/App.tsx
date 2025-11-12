import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { ResetPasswordScreen } from './resetPassword';
import { WelcomeDialog } from './components/WelcomeDialog';
import { ProfileUpdateReminderDialog } from './components/ProfileUpdateReminderDialog';
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
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { TermsOfUseScreen } from './components/TermsOfUseScreen';
import { AdvertiserTermsScreen } from './components/AdvertiserTermsScreen';

import SignupSuccessPage  from './sucess';
import Loading from './loading';
import { Toaster } from './components/ui/sonner';
import { API_BASE_URL } from './config/api';

type UserType = 'passenger' | 'driver' | 'advertiser' | 'admin' | null;
type Screen =
  | 'login'
  | 'signup'
  | 'signup-success'
  | 'forgot-password'
  | 'reset-password'
  | 'terms-of-use'
  | 'privacy-policy'
  | 'advertiser-terms'
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
  const [showProfileReminder, setShowProfileReminder] = useState(false);
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

  // Suporta rota direta para reset de senha via URL (ex: /reset-password?token=...)
  useEffect(() => {
    try {
      const path = window.location.pathname || '';
      if (path === '/reset-password' || path.startsWith('/reset-password')) {
        setCurrentScreen('reset-password');
      }
    } catch (err) {
      // fallback silencioso
    }
  }, []);

  // Carregar usuário do token JWT
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoadingUser(false);
        setShowWelcome(false);
        setShowProfileReminder(false);
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

        const userId = (decoded as any)?.sub;
        
        if (userId) {
          try {
            const welcomeKey = `welcome_shown_${userId}`;
            const profileReminderKey = `profile_reminder_shown_${userId}`;
            const hasSeenWelcome = !!localStorage.getItem(welcomeKey);
            const hasSeenProfileReminder = !!localStorage.getItem(profileReminderKey);
            
            try {
              const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              if (response.ok) {
                const userData = await response.json();
                const cutoffDate = new Date('2025-11-01T00:00:00.000Z');
                let userCreatedAt: Date;
                try {
                  if (userData.createdAt) {
                    if (typeof userData.createdAt === 'string') {
                      userCreatedAt = new Date(userData.createdAt);
                    } else if (userData.createdAt.$date) {
                      userCreatedAt = new Date(userData.createdAt.$date);
                    } else if (userData.createdAt instanceof Date) {
                      userCreatedAt = userData.createdAt;
                    } else {
                      userCreatedAt = new Date(userData.createdAt);
                    }
                  } else {
                    userCreatedAt = new Date();
                  }
                } catch {
                  userCreatedAt = new Date();
                }
                const isLegacyUser = userCreatedAt.getTime() < cutoffDate.getTime();
                
                if (isLegacyUser && !hasSeenProfileReminder) {
                  setShowProfileReminder(true);
                  setShowWelcome(false);
                } else {
                  setShowProfileReminder(false);
                  setShowWelcome(!hasSeenWelcome);
                }
              } else {
                setShowProfileReminder(false);
                setShowWelcome(!hasSeenWelcome);
              }
            } catch {
              setShowProfileReminder(false);
              setShowWelcome(!hasSeenWelcome);
            }
          } catch {
            setShowWelcome(false);
            setShowProfileReminder(false);
          }
        } else {
          setShowWelcome(false);
          setShowProfileReminder(false);
        }
      } catch (err) {
        console.error('Token inválido:', err);
        localStorage.removeItem('token');
        setUserType(null);
        setUser(null);
        setCurrentScreen('login');
        setShowWelcome(false);
        setShowProfileReminder(false);
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUser();
  }, []);

  // Login
  const handleLogin = (
    type: 'passenger' | 'driver' | 'advertiser' | 'admin',
    token?: string,
    isLegacyUserFromAuth: boolean = false
  ) => {
    if (token) localStorage.setItem('token', token);
    setUserType(type);

    let decoded: (JwtPayload & { sub?: string }) | null = null;
    if (token) {
      try {
        decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    }

    const userId = decoded?.sub;
    if (userId) {
      try {
        const welcomeKey = `welcome_shown_${userId}`;
        const profileReminderKey = `profile_reminder_shown_${userId}`;
        const hasSeenWelcome = !!localStorage.getItem(welcomeKey);
        const hasSeenProfileReminder = !!localStorage.getItem(profileReminderKey);
        
        if (isLegacyUserFromAuth && !hasSeenProfileReminder) {
          setShowProfileReminder(true);
          setShowWelcome(false);
        } else {
          setShowProfileReminder(false);
          setShowWelcome(!hasSeenWelcome);
        }
      } catch {
        if (isLegacyUserFromAuth) {
          setShowProfileReminder(true);
          setShowWelcome(false);
        } else {
          setShowWelcome(true);
          setShowProfileReminder(false);
        }
      }
    } else {
      setShowWelcome(false);
      setShowProfileReminder(false);
    }

    setCurrentScreen('dashboard');
  };

  // Signup
  const handleSignup = (type: 'passenger' | 'driver' | 'advertiser' | 'admin') => {
    setUserType(type);
    setCurrentScreen('dashboard');
    setShowWelcome(true);
    setShowProfileReminder(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserType(null);
    setUser(null);
    setCurrentScreen('login');
    setShowWelcome(false);
    setShowProfileReminder(false);
  };

  const handleNavigate = (screen: string) => setCurrentScreen(screen as Screen);

  const getCurrentUserId = () => {
    if ((user as any)?.sub) {
      return (user as any).sub as string;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const decoded = jwtDecode<JwtPayload & { sub?: string }>(token);
      return decoded?.sub ?? null;
    } catch {
      return null;
    }
  };

  const markWelcomeAsSeen = () => {
    const userId = getCurrentUserId();
    if (!userId) return;
    try {
      localStorage.setItem(`welcome_shown_${userId}`, 'true');
    } catch {
    }
  };

  const markProfileReminderAsSeen = () => {
    const userId = getCurrentUserId();
    if (!userId) return;
    try {
      localStorage.setItem(`profile_reminder_shown_${userId}`, 'true');
    } catch {
    }
  };

  const handleCloseWelcome = () => {
    markWelcomeAsSeen();
    setShowWelcome(false);
  };

  const handleDismissProfileReminder = () => {
    markProfileReminderAsSeen();
    setShowProfileReminder(false);
  };

  const handleNavigateToProfileFromReminder = () => {
    markProfileReminderAsSeen();
    setShowProfileReminder(false);
    setCurrentScreen('profile');
  };

  // Inicia chat por outra tela
  const handleStartChat = (id: string, name: string, avatar?: string) => {
    setPendingChat({ id, name, avatar });
    setCurrentScreen('chat');
  };

  if (isLoadingUser) {
    return <Loading />;
  }

  if (currentScreen === 'privacy-policy') return <PrivacyPolicyScreen onNavigate={handleNavigate} />;
  if (currentScreen === 'terms-of-use') return <TermsOfUseScreen onNavigate={handleNavigate} />;
  if (currentScreen === 'advertiser-terms') return <AdvertiserTermsScreen onNavigate={handleNavigate} />;

  // Telas públicas
  if (currentScreen === 'login') return <LoginScreen onNavigate={handleNavigate} onLogin={handleLogin} />;
  if (currentScreen === 'signup') return <SignupScreen onNavigate={handleNavigate} />;
  if (currentScreen === 'reset-password') return <ResetPasswordScreen onNavigate={handleNavigate} />;

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
        <>
          <WelcomeDialog
            isOpen={showWelcome}
            onClose={handleCloseWelcome}
            userType={userType}
          />
          <ProfileUpdateReminderDialog
            isOpen={showProfileReminder}
            onClose={handleDismissProfileReminder}
            onNavigateToProfile={handleNavigateToProfileFromReminder}
          />
        </>
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
        {currentScreen === 'dashboard' && userType === 'admin' && <AdminDashboard onNavigate={handleNavigate}/>}
        {currentScreen === 'dashboard' && userType !== 'admin' && (
          <HomeDashboard onNavigate={handleNavigate} userType={userType} onStartChat={handleStartChat} />
        )}
        {currentScreen === 'search' && userType === 'passenger' && <PassengerDashboard onNavigate={handleNavigate} onStartChat={handleStartChat} />}
        {currentScreen === 'search' && userType === 'advertiser' && (
          <AdvertiserDashboard onNavigate={handleNavigate} userId={(user as any)?.sub} />
        )}
        {currentScreen === 'blog' && <BlogScreen onNavigate={handleNavigate}/>}
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
        {currentScreen === 'profile' && <ProfileScreen onLogout={handleLogout} theme={theme} onThemeChange={setTheme} onNavigate={handleNavigate}/>}
      </div>
      <Toaster />
    </div>
  );
}
