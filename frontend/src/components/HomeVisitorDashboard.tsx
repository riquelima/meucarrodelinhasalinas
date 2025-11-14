import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { LogIn } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search, Car as CarIcon, HandshakeIcon, Radio, Star } from "lucide-react";
import { AdCarousel } from "./AdCarousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ScrollToTop } from "./ScrollToTop";

interface HomeVisitorDashboardProps {
  onNavigate: (screen: string) => void;
}

const MOCK_DRIVERS = [
  {
    _id: 'drv1',
    name: 'João Silva',
    avatar: '',
    avgRating: 4.9,
    totalReviews: 124,
    status: 'online',
    vehicle: 'Fiat Uno',
    licensePlate: 'ABC-1234',
    origin: 'Salvador',
    destination: 'Salinas de Margarida',
    number: '+55 31 9 0000-0000',
    availableDays: 'Seg - Sex',
    description: 'Motorista experiente e cordial.'
  },
  {
    _id: 'drv2',
    name: 'Maria Costa',
    avatar: '',
    avgRating: 4.8,
    totalReviews: 98,
    status: 'offline',
    vehicle: 'Chevrolet Onix',
    licensePlate: 'XYZ-9876',
    origin: 'Salinas (Centro)',
    destination: 'Santo Antônio de Jesus',
    number: '+55 31 9 1111-1111',
    availableDays: 'Seg - Dom',
    description: 'Sempre pontual e educada.'
  }
];

const MOCK_BLOGS = [
  {
    _id: 'b1',
    title: 'Novidades no aplicativo',
    content: 'Estamos lançando melhorias para tornar suas viagens mais seguras e rápidas.',
    image: '/assets/placeholder-blog.jpg',
    createdAt: new Date().toISOString(),
    authorName: 'Equipe'
  },
  {
    _id: 'b2',
    title: 'Dicas para viajar',
    content: 'Conheça boas práticas para aproveitar melhor seus trajetos conosco.',
    image: '/assets/placeholder-blog.jpg',
    createdAt: new Date().toISOString(),
    authorName: 'Equipe'
  }
];

export function HomeVisitorDashboard({ onNavigate }: HomeVisitorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [blogs, setBlogs] = useState<any[]>(MOCK_BLOGS);
  const [showHowToCallModal, setShowHowToCallModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);

  const filteredDrivers = MOCK_DRIVERS.filter(d => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return d.name.toLowerCase().includes(lower) || `${d.origin} → ${d.destination}`.toLowerCase().includes(lower);
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blogs/home`);
        if (!res.ok) throw new Error('Erro ao buscar blogs');
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        // keep mocks on error
        console.warn('Falha ao buscar blogs, usando mocks', err);
        setBlogs(MOCK_BLOGS);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8">
        <div className="space-y-4 text-center py-6 lg:py-8">
          <h1 className="text-foreground mb-3 text-2xl lg:text-3xl">Seu Carro de Linha, na Palma da Mão</h1>
          <p className="text-muted-foreground text-sm lg:text-base max-w-2xl mx-auto px-4">
            Conheça o app e veja como é simples chamar um motorista na sua região.
          </p>          

          <div className="max-w-2xl mx-auto mt-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar rota ou motorista..."
                className="pl-12 h-16 bg-input-background text-base border-border shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="blue-500 mt-4">
            <Button onClick={() => onNavigate('login')}>
              Conheça o Meu Carro de Linha
              <LogIn className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-foreground mb-3">Anúncios em Destaque</h2>
          <AdCarousel />
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              onClick={() => setShowHowToCallModal(true)}
              variant="outline"
              className="h-auto py-3 px-4 flex items-center justify-start gap-3 border-yellow-500/50 hover:bg-yellow-500/10"
            >
              <CarIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div className="text-left">
                <div className="text-foreground text-sm">Como Chamar um Carro</div>
                <div className="text-muted-foreground text-xs">Veja o passo a passo</div>
              </div>
            </Button>

            <Button
              onClick={() => setShowTipsModal(true)}
              variant="outline"
              className="h-auto py-3 px-4 flex items-center justify-start gap-3 border-green-500/50 hover:bg-green-500/10"
            >
              <HandshakeIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <div className="text-left">
                <div className="text-foreground text-sm">Dicas de Boa Convivência</div>
                <div className="text-muted-foreground text-xs">Aprenda as melhores práticas</div>
              </div>
            </Button>
          </div>

        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <h2 className="text-foreground">Motoristas em Destaque</h2>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {filteredDrivers.slice(0, 3).map(driver => (
              <Card key={driver._id} className="shadow-sm hover:shadow-md transition-shadow bg-card border-border">
                <CardHeader className="px-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                      {driver.avatar ? (
                        <ImageWithFallback src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
                      ) : null}
                      {!driver.avatar && (
                        <AvatarFallback className="bg-green-600 text-white">
                              {driver.name.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-foreground text-base sm:text-lg truncate">{driver.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">{driver.avgRating}</span>
                            <span className="text-muted-foreground text-xs sm:text-sm">({driver.totalReviews} avaliações)</span>
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className={`flex-shrink-0 text-xs sm:text-sm border-0 ${driver.status === 'online' ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'}`}>
                          {driver.status === 'online' ? 'Online' : 'Offline'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 p-4 pt-0">
                  <div className="flex items-start gap-2">
                    <CarIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-sm">{driver.vehicle} - {driver.licensePlate}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-foreground text-sm">{driver.origin} → {driver.destination}</span>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm">{driver.description}</p>
                  <div className="pt-2">
                    <Button onClick={() => onNavigate('login')} variant="outline" className="w-full">Conversar com motorista</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <h2 className="text-foreground">Últimas Notícias</h2>
            <Button onClick={() => onNavigate('login')} variant="outline" className="w-full sm:w-auto h-9">Ver Blog</Button>
          </div>

          {blogs.map((post) => {
            const preview = post.content && post.content.length > 120 ? post.content.slice(0, 120) + '...' : post.content;
            return (
            <Card key={post._id} className="shadow-sm bg-card border-border mb-3">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <img src={post.image} alt={post.title} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-foreground mb-1">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{preview}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-blue-500 text-xs">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                      <span className="text-muted-foreground text-xs">Por {post.authorName}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="p-4 pt-0">
        <AdCarousel />
      </div>

      <ScrollToTop />
      {/* Modal: Como Chamar um Carro */}
      <Dialog open={showHowToCallModal} onOpenChange={setShowHowToCallModal}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CarIcon className="w-6 h-6 text-yellow-500" />
              <DialogTitle className="text-foreground text-xl">Como Chamar um Carro</DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Instruções passo a passo de como solicitar uma corrida
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3 text-sm">
              <p className="text-foreground">
                <span className="text-yellow-500 mr-2">1. Faça Login:</span>
                Para contatar um motorista, primeiro <button onClick={() => { setShowHowToCallModal(false); onNavigate('login'); }} className="text-blue-500 underline">crie sua conta</button> ou faça o <button onClick={() => { setShowHowToCallModal(false); onNavigate('login'); }} className="text-blue-500 underline">login</button>.
              </p>
              <p className="text-foreground">
                <span className="text-yellow-500 mr-2">2. Escolha seu Motorista:</span>
                Na lista acima, clique em um motorista que esteja <span className="text-green-500">Online</span> para uma corrida imediata, ou agende com qualquer um mesmo <span className="text-gray-500">Offline</span>.
              </p>
              <p className="text-foreground">
                <span className="text-yellow-500 mr-2">3. Chame no WhatsApp:</span>
                Use o botão "Agendar uma Viagem" para iniciar uma conversa direta com o motorista.
              </p>
              <p className="text-foreground">
                <span className="text-yellow-500 mr-2">4. Combine a Corrida:</span>
                Aceite o valor, o local de partida e o destino diretamente com o motorista. O pagamento é feito diretamente ao motorista.
              </p>
            </div>
            <div className="pt-4 border-t border-border">
              <Button 
                onClick={() => setShowHowToCallModal(false)} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Entendi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Dicas de Boa Convivência */}
      <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <HandshakeIcon className="w-6 h-6 text-green-500" />
              <DialogTitle className="text-foreground text-xl">Dicas de Boa Convivência</DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Recomendações para uma experiência agradável entre passageiros e motoristas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3 text-sm">
              <p className="text-foreground">
                <span className="text-green-500 mr-2">Respeito Mútuo:</span>
                O motorista é um profissional que presta um serviço público. Trate-o com a mesma cordialidade que você espera receber.
              </p>
              <p className="text-foreground">
                <span className="text-green-500 mr-2">Cuidado com o Veículo:</span>
                O carro é o instrumento de trabalho do motorista. Evite bater a porta, não deixe lixo dentro dele e cuide do seu se fosse seu.
              </p>
              <p className="text-foreground">
                <span className="text-green-500 mr-2">Seja Pontual:</span>
                Combine um horário e local e esteja pronto. Isso ajuda o motorista a manter sua agenda e atender outros passageiros.
              </p>
              <p className="text-foreground">
                <span className="text-green-500 mr-2">Avalie o Serviço:</span>
                Após a corrida, volte ao seu painel e avalie o motorista. O seu feedback é importante para a comunidade e outros passageiros.
              </p>
            </div>
            <div className="pt-4 border-t border-border">
              <Button 
                onClick={() => setShowTipsModal(false)} 
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Entendi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HomeVisitorDashboard;
