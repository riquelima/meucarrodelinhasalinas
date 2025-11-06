import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Car, ArrowLeft, CheckCircle } from "lucide-react";
import { API_BASE_URL } from "./config/api";

interface ResetPasswordScreenProps {
  onNavigate: (screen: string) => void;
}

export function ResetPasswordScreen({ onNavigate }: ResetPasswordScreenProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Extrai o token da URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setFormError("Token inválido ou ausente. Solicite um novo link de recuperação.");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    setIsSuccess(false);

    if (newPassword !== confirmPassword) {
      setFormError("As senhas não coincidem.");
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 6) {
      setFormError("A senha deve ter pelo menos 6 caracteres.");
      setIsSubmitting(false);
      return;
    }

    if (!token) {
      setFormError("Token inválido. Solicite um novo link de recuperação.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token,
          newPassword 
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const data = await response.json();
        setFormError(data.message || "Erro ao redefinir senha. Tente novamente.");
      }
    } catch (err: any) {
      setFormError("Erro ao conectar com o servidor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg bg-card border-border">
        <CardHeader className="text-center space-y-3 p-6">
          <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Car className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
          </div>
          <CardTitle className="text-foreground text-xl lg:text-2xl">Nova Senha</CardTitle>
          <CardDescription className="text-sm">
            {isSuccess 
              ? "Sua senha foi redefinida com sucesso!"
              : "Preencha os campos abaixo para definir sua nova senha."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {isSuccess ? (
            <div className="space-y-6 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-muted-foreground text-base">
                Agora você pode usar sua nova senha para acessar sua conta.
              </p>
              <Button 
                onClick={() => onNavigate('login')} 
                className="w-full bg-blue-600 hover:bg-blue-700 h-11"
              >
                Ir para o Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-input-background h-11"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={!token || isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm">Repetir Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-input-background h-11"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={!token || isSubmitting}
                />
              </div>

              {formError && (
                <div className="p-3 bg-red-600/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-500 text-sm text-center">{formError}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-11"
                disabled={!token || isSubmitting}
              >
                {isSubmitting ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>
          )}
          
          {!isSuccess && (
            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigate('login')}
                className="text-blue-500 hover:underline text-sm flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o Login
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}