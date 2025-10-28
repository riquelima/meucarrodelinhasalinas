import { CheckCircle, Home, LogIn } from "lucide-react";
import { Button } from "./components/ui/button";

interface SignupSuccessProps {
  message?: string;
  onLogin?: () => void;    // Ir para a tela de login
}

export default function SignupSuccessPage({ message, onLogin }: SignupSuccessProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Ícone de sucesso */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-600/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        {/* Mensagem */}
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl">Registro Concluído!</h1>
          <p className="text-muted-foreground text-sm">
            {message || "Sua conta foi criada com sucesso. Agora você pode fazer login."}
          </p>
        </div>

        {/* Botão */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {onLogin && (
            <Button
              onClick={onLogin}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Ir para Login
            </Button>
          )}
        </div>

        {/* Rodapé */}
        <div className="pt-4 border-t border-border">
          <p className="text-muted-foreground text-xs">
            Se houver algum problema, entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
