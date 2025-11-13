import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle, Settings } from "lucide-react";

interface ProfileUpdateReminderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProfile: () => void;
}

export function ProfileUpdateReminderDialog({
  isOpen,
  onClose,
  onNavigateToProfile,
}: ProfileUpdateReminderDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative bg-amber-500 p-6 rounded-full">
              <AlertTriangle className="w-12 h-12 text-white" />
              <Settings className="w-6 h-6 text-amber-900 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <DialogTitle className="text-foreground text-center text-xl">
            Precisamos que você atualize seu perfil
          </DialogTitle>
          <DialogDescription className="text-center pt-4 text-base">
            Migramos seus dados do aplicativo anterior e alguns campos obrigatórios receberam valores provisórios. Acesse as configurações de perfil e substitua essas informações pelas corretas para continuar usando a plataforma sem limitações.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 pt-4">
          <Button 
            className="bg-amber-500 hover:opacity-90 w-full text-white"
            onClick={onNavigateToProfile}
          >
            Ir para Configurações
          </Button>
          <Button 
            variant="ghost" 
            className="w-full"
            onClick={onClose}
          >
            Agora não
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


