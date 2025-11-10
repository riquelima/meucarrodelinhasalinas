import { useState } from "react";
import { FileText, Shield, Share2, MessageSquare, Car, Instagram, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { SupportModal } from "./SupportModal";

export function Footer({ onNavigate }: { onNavigate?: (path: string) => void }) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  
  const handleOpenSupport = () => setIsSupportOpen(true);
  const handleCloseSupport = () => setIsSupportOpen(false);

  const handleShare = async () => {
    const shareUrl = window.location.origin + window.location.pathname;
    const title = 'Meu Carro de Linha';
    const text = `Confira ${title}: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        setShareStatus('Compartilhado');
        setTimeout(() => setShareStatus(null), 2500);
        return;
      } catch (err) {
        console.debug('share cancelled or failed', err);
      }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus('Link copiado para a área de transferência');
        setTimeout(() => setShareStatus(null), 2500);
      }
    } catch (err) {
      console.debug('clipboard write failed', err);
    }

    const whatsappText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${whatsappText}`;
    window.open(whatsappUrl, '_blank', 'noopener');
  };
  
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: "Termos de Uso", icon: FileText, screen: "terms-of-use" },
    { label: "Política de Privacidade", icon: Shield, screen: "privacy-policy" },
  ];

  const communityLinks = [
    { label: "Compartilhar", icon: Share2, action: handleShare },
    { label: "Fale Conosco", icon: MessageSquare, action: handleOpenSupport },
  ];

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Logo e descrição */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Logo className="w-10 h-10" />
            <h3 className="text-foreground">Meu Carro de Linha</h3>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Conectando passageiros e motoristas em Salinas. Seu táxi, agora na palma da mão.
          </p>
        </div>

        {/* Seções de links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          
          {/* Sessão Legal */}
          <div>
            <h4 className="text-foreground mb-4 text-center sm:text-left">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <button
                      onClick={() => onNavigate && onNavigate(link.screen)}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto justify-center sm:justify-start text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sessão Comunidade */}
          <div>
            <h4 className="text-foreground mb-4 text-center sm:text-left">Comunidade</h4>
            <ul className="space-y-3">
              {communityLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto justify-center sm:justify-start text-sm"
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Social */}
        <div className="flex justify-center gap-4 mb-8">
          <a 
            href="https://wa.me/5591987654321" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
            aria-label="WhatsApp"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </a>
          <a 
            href="https://instagram.com/meucarrodelinha" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:opacity-90 rounded-full flex items-center justify-center transition-opacity"
            aria-label="Instagram"
          >
            <Instagram className="w-6 h-6 text-white" />
          </a>
        </div>

        {/* Share feedback */}
        {shareStatus && (
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">{shareStatus}</p>
          </div>
        )}

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-muted-foreground text-xs">
            © {currentYear} Meu Carro de Linha. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Modal de suporte */}
      <SupportModal open={isSupportOpen} onClose={handleCloseSupport} />
      
    </footer>
  );
}
