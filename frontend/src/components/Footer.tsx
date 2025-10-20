import { FileText, Shield, Share2, MessageSquare, Car, Instagram, MessageCircle } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: "Termos de Uso", icon: FileText },
    { label: "Política de Privacidade", icon: Shield },
  ];

  const communityLinks = [
    { label: "Compartilhar", icon: Share2 },
    { label: "Fale Conosco", icon: MessageSquare },
  ];

  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Logo and description */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-foreground">Meu Carro de Linha</h3>
          </div>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Conectando passageiros e motoristas em Salinas. Seu táxi, agora na palma da mão.
          </p>
        </div>

        {/* Links sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* Legal Section */}
          <div>
            <h4 className="text-foreground mb-4 text-center sm:text-left">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto justify-center sm:justify-start text-sm">
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Community Section */}
          <div>
            <h4 className="text-foreground mb-4 text-center sm:text-left">Comunidade</h4>
            <ul className="space-y-3">
              {communityLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-full sm:w-auto justify-center sm:justify-start text-sm">
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Social Media Icons */}
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

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-border">
          <p className="text-muted-foreground text-xs">
            © {currentYear} Meu Carro de Linha. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
