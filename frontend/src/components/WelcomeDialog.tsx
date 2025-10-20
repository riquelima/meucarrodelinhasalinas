import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Car, Sparkles } from "lucide-react";

interface WelcomeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'passenger' | 'driver' | 'advertiser' | 'admin';
}

export function WelcomeDialog({ isOpen, onClose, userType }: WelcomeDialogProps) {
  const getWelcomeMessage = () => {
    switch (userType) {
      case 'passenger':
        return {
          title: "Bem-vindo ao Meu Carro de Linha! 🎉",
          message: "Que ótimo ter você conosco! Agora você pode encontrar motoristas de confiança, agendar suas viagens e se locomover pela cidade com muito mais facilidade. Explore o app e aproveite sua primeira viagem!"
        };
      case 'driver':
        return {
          title: "Bem-vindo, Motorista! 🚗",
          message: "Estamos muito felizes em tê-lo na nossa plataforma! Agora você pode gerenciar suas rotas, conectar-se com passageiros e aumentar sua renda. Boa sorte nas estradas!"
        };
      case 'advertiser':
        return {
          title: "Bem-vindo, Anunciante! 📢",
          message: "É um prazer tê-lo conosco! Sua jornada para alcançar milhares de usuários começa agora. Crie campanhas incríveis e veja seu negócio crescer. Vamos juntos nessa!"
        };
      case 'admin':
        return {
          title: "Bem-vindo, Administrador! 👨‍💼",
          message: "Acesso administrativo concedido. Você agora tem controle total sobre a plataforma. Gerencie usuários, anúncios e conteúdo com responsabilidade."
        };
    }
  };

  const getColor = () => {
    switch (userType) {
      case 'passenger': return 'bg-blue-600';
      case 'driver': return 'bg-green-600';
      case 'advertiser': return 'bg-purple-400';
      case 'admin': return 'bg-red-600';
    }
  };

  const { title, message } = getWelcomeMessage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className={`relative ${getColor()} p-6 rounded-full`}>
              <Car className="w-12 h-12 text-white" />
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <DialogTitle className="text-foreground text-center text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center pt-4 text-base">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button 
            className={`${getColor()} hover:opacity-90 w-full`}
            onClick={onClose}
          >
            Começar Agora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
