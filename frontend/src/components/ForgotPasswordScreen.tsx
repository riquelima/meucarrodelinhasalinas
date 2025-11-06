import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Car, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { API_BASE_URL } from "../config/api";

interface ForgotPasswordScreenProps {
  onNavigate: (screen: string) => void;
}

export function ForgotPasswordScreen({ onNavigate }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsLoading(true);
      setError("");
      
      try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setEmailSent(true);
        } else {
          const data = await response.json();
          setError(data.message || "Erro ao enviar e-mail de recuperação");
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg bg-card border-border">
        <CardHeader className="text-center space-y-3 p-6">
          <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Car className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
          </div>
          <CardTitle className="text-foreground text-xl lg:text-2xl">Recuperar Senha</CardTitle>
          <CardDescription className="text-sm">
            {emailSent 
              ? "Verifique seu e-mail para instruções de recuperação"
              : "Digite seu e-mail para receber as instruções"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {!emailSent ? (
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
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <div className="p-4 bg-red-600/10 border border-red-500/50 rounded-lg">
                  <p className="text-red-500 text-sm text-center">
                    {error}
                  </p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 h-11"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar E-mail de Recuperação"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-600/10 border border-green-500/50 rounded-lg">
                <p className="text-green-500 text-sm text-center">
                  ✓ Um e-mail de recuperação foi enviado para <strong>{email}</strong>
                </p>
              </div>
              <p className="text-muted-foreground text-xs text-center">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                Não esqueça de verificar a pasta de spam.
              </p>
            </div>
          )}
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('login')}
              className="text-blue-500 hover:underline text-sm flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}