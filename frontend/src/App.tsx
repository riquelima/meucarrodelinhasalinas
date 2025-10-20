import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { SignupScreen } from './components/SignupScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { WelcomeDialog } from './components/WelcomeDialog';
import { Sidebar, getUnreadMessages } from './components/Sidebar';
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

type UserType = 'passenger' | 'driver' | 'advertiser' | 'admin' | null;
type Screen = 'login' | 'signup' | 'forgot-password' | 'dashboard' | 'search' | 'chat' | 'profile' | 'blog' | 'calculator';
type Theme = 'light' | 'dark';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userType, setUserType] = useState<UserType>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleLogin = (type: 'passenger' | 'driver' | 'advertiser' | 'admin') => {
    setUserType(type);
    setCurrentScreen('dashboard');
  };

  const handleSignup = (type: 'passenger' | 'driver' | 'advertiser' | 'admin') => {
    setUserType(type);
    setCurrentScreen('dashboard');
    setShowWelcome(true);
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentScreen('login');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  // Render authentication screens
  if (currentScreen === 'login') {
    return <LoginScreen onNavigate={handleNavigate} onLogin={handleLogin} />;
  }

  if (currentScreen === 'signup') {
    return <SignupScreen onNavigate={handleNavigate} onSignup={handleSignup} />;
  }

  if (currentScreen === 'forgot-password') {
    return <ForgotPasswordScreen onNavigate={handleNavigate} />;
  }

  // Render main app with sidebar
  if (!userType) return null;

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
        unreadMessages={getUnreadMessages()}
        theme={theme}
        onThemeChange={setTheme}
      />
      <Sidebar
        userType={userType}
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
      />
      <div className="w-full">
        {currentScreen === 'dashboard' && userType === 'admin' && (
          <AdminDashboard />
        )}
        {currentScreen === 'dashboard' && userType !== 'admin' && (
          <HomeDashboard onNavigate={handleNavigate} userType={userType} />
        )}
        {currentScreen === 'search' && userType === 'passenger' && (
          <PassengerDashboard onNavigate={handleNavigate} />
        )}
        {currentScreen === 'search' && userType === 'driver' && (
          <DriverDashboard onNavigate={handleNavigate} />
        )}
        {currentScreen === 'search' && userType === 'advertiser' && (
          <AdvertiserDashboard onNavigate={handleNavigate} />
        )}
        {currentScreen === 'blog' && <BlogScreen />}
        {currentScreen === 'chat' && userType !== 'admin' && <ChatScreen userType={userType} />}
        {currentScreen === 'calculator' && <RideCalculatorScreen userType={userType} />}
        {currentScreen === 'profile' && <ProfileScreen userType={userType} onLogout={handleLogout} theme={theme} onThemeChange={setTheme} />}
      </div>
    </div>
  );
}