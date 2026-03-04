import { useState, type FormEvent } from "react";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Logo } from "./Logo";
import { API_BASE_URL } from "../config/api";

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  onLogin: (userType: 'passenger' | 'driver' | 'advertiser' | 'admin', token: string, isLegacyUser: boolean) => void;
}

export function LoginScreen({ onNavigate, onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message || "Falha ao realizar login"
        );
      }

      const token = data.access_token;
      const isLegacyUser = !!data.isLegacyUser;
      if (!token) throw new Error("Token não recebido");

      const parseJwt = (token: string) => {
        try {
          const base64 = token.split('.')[1];
          const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
          );
          return JSON.parse(jsonPayload);
        } catch { return null; }
      };

      const payload = parseJwt(token);
      let mappedRole: "driver" | "passenger" | "advertiser" | "admin" = "passenger";
      if (payload?.role) {
        const role = payload.role.toLowerCase();
        mappedRole = role === "motorista" ? "driver" : role === "passageiro" ? "passenger" : role === "anunciante" ? "advertiser" : "admin";
      }
      onLogin(mappedRole, token, isLegacyUser);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 90% 60% at 50% -5%, rgba(37,99,235,0.22) 0%, transparent 65%),
          radial-gradient(ellipse 55% 45% at 85% 105%, rgba(124,58,237,0.14) 0%, transparent 55%),
          radial-gradient(ellipse 35% 35% at 10% 85%, rgba(16,185,129,0.07) 0%, transparent 55%),
          linear-gradient(175deg, #070b16 0%, #060910 100%)
        `
      }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              background: i % 2 === 0 ? 'rgba(59,130,246,0.4)' : 'rgba(124,58,237,0.3)',
              top: `${15 + i * 14}%`,
              left: `${8 + i * 15}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <div
            key={`r-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${3 + i * 2}px`,
              height: `${3 + i * 2}px`,
              background: i % 2 === 0 ? 'rgba(16,185,129,0.35)' : 'rgba(59,130,246,0.3)',
              top: `${20 + i * 18}%`,
              right: `${10 + i * 13}%`,
              animation: `float ${2.5 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.4 + 1}s`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="glass-card w-full max-w-md rounded-2xl p-8 animate-scale-in"
        style={{ boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 60px rgba(37,99,235,0.08)' }}
      >
        {/* Logo + Brand */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-blue-500/25 blur-xl animate-glow-pulse" />
            <Logo className="mx-auto w-16 h-16 relative z-10 animate-float" />
          </div>
          <h1
            className="text-2xl font-bold gradient-text mb-1"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.03em' }}
          >
            Meu Carro de Linha
          </h1>
          <p className="text-slate-400 text-sm">
            Conectando passageiros, motoristas e anunciantes
          </p>
        </div>

        {/* Error */}
        {formError && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-fade-in">
            {formError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in-up delay-100">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-slate-300 text-sm font-medium block">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="w-full h-12 pl-10 pr-4 rounded-xl text-slate-200 placeholder-slate-600 text-sm input-glow"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-slate-300 text-sm font-medium block">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full h-12 pl-10 pr-12 rounded-xl text-slate-200 placeholder-slate-600 text-sm input-glow"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-gradient w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-center space-y-3 animate-fade-in-up delay-200">
          <p className="text-slate-500 text-sm">
            Não tem uma conta?{" "}
            <button
              onClick={() => onNavigate("signup")}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
            >
              Cadastrar-se
            </button>
          </p>
          <p>
            <button
              onClick={() => onNavigate("forgot-password")}
              className="text-slate-500 hover:text-slate-400 text-sm transition-colors hover:underline"
            >
              Esqueceu sua senha?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
