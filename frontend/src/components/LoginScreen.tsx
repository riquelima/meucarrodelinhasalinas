import { useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Car } from "lucide-react";
import { Logo } from "./Logo";
import ErrorPage from "../error";
import Loading from "../loading";
import { API_BASE_URL } from "../config/api";

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
  onLogin: (userType: 'passenger' | 'driver' | 'advertiser' | 'admin', token: string, isLegacyUser: boolean) => void;
}

export function LoginScreen({ onNavigate, onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(jsonPayload);
        } catch {
          return null;
        }
      };

      const payload = parseJwt(token);
      let mappedRole: "driver" | "passenger" | "advertiser" | "admin" = "passenger";

      if (payload?.role) {
        const role = payload.role.toLowerCase();
        mappedRole =
          role === "motorista" ? "driver" :
          role === "passageiro" ? "passenger" :
          role === "anunciante" ? "advertiser" :
          "admin";
      }
      onLogin(mappedRole, token, isLegacyUser);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  if (formError) {
    return (
      <ErrorPage
        error={new Error(formError)}
        reset={() => setFormError(null)}
        onHome={() => onNavigate("home")}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg bg-card border-border">
        <CardHeader className="text-center space-y-3 p-6">
          <Logo className="mx-auto w-14 h-14 lg:w-16 lg:h-16" />
          <CardTitle className="text-foreground text-xl lg:text-2xl">Meu Carro de Linha</CardTitle>
          <CardDescription className="text-sm">
            Conectando passageiros, motoristas e anunciantes
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="bg-input-background h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-input-background h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11">
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-muted-foreground text-sm">
              Não tem uma conta?{" "}
              <button
                onClick={() => onNavigate("signup")}
                className="text-blue-500 hover:underline"
              >
                Cadastrar-se
              </button>
            </p>
            <p className="text-muted-foreground text-sm">
              <button
                onClick={() => onNavigate("forgot-password")}
                className="text-blue-500 hover:underline"
              >
                Esqueceu sua senha?
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
