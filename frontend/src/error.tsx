import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./components/ui/button";

interface ErrorProps {
  error?: Error;
  reset?: () => void;
  onHome?: () => void;
}

export default function ErrorPage({ error, reset, onHome }: ErrorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-foreground text-2xl">Algo deu errado</h1>
          <p className="text-muted-foreground text-sm">
            {error?.message || "Ocorreu um erro inesperado. Por favor, tente novamente."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {reset && (
            <Button 
              onClick={reset}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
          )}
          {onHome && (
            <Button 
              onClick={onHome}
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          )}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-muted-foreground text-xs">
            Se o problema persistir, entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
