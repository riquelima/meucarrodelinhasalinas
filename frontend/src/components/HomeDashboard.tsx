import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Star, MapPin, Clock, Phone, Search, Car as CarIcon, MessageCircle, HandshakeIcon, ThumbsUp, Radio } from "lucide-react";
import { AdCarousel } from "./AdCarousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { API_BASE_URL } from "../config/api";

interface HomeDashboardProps {
  onNavigate: (screen: string) => void;
  userType: 'passenger' | 'driver' | 'advertiser' | 'admin';
  onStartChat?: (userId: string, name: string, avatar?: string) => void;
}

export function HomeDashboard({ onNavigate, userType, onStartChat }: HomeDashboardProps) {
  const [showHowToCallModal, setShowHowToCallModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showStatusHelpModal, setShowStatusHelpModal] = useState(false);

  const [drivers, setDrivers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState<any[]>([]);

  // Buscar motoristas do backend
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/motoristas/profile-views/top`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Erro ao buscar motoristas");
        const data = await response.json();
        setDrivers(data);
        setFilteredDrivers(data);
      } catch (err) {
        console.error(err);
        setDrivers([]);
        setFilteredDrivers([]);
      }
    };
    fetchDrivers();
  }, []);

  // Buscar blogs do backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/blogs/home`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        console.error("Erro ao carregar blogs", err);
        setBlogs([]);
      }
    };
    fetchBlogs();
  }, []);

  // Filtrar motoristas por nome ou rota
  useEffect(() => {
    if (!searchTerm) return setFilteredDrivers(drivers);

    const lowerSearch = searchTerm.toLowerCase();

    const filtered = drivers.filter(driver =>
      driver.name.toLowerCase().includes(lowerSearch) ||
      `${driver.origin} → ${driver.destination}`.toLowerCase().includes(lowerSearch)
    );

    setFilteredDrivers(filtered);
  }, [searchTerm, drivers]);

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8">
        {/* Hero Section */}
        <div className="space-y-4 text-center py-6 lg:py-8">
          <h1 className="text-foreground mb-3 text-2xl lg:text-3xl">Seu Carro de Linha, na Palma da Mão</h1>
          <p className="text-muted-foreground text-sm lg:text-base max-w-2xl mx-auto px-4">
            Em nossa região, táxi sempre foi carro de linha. Agora, com o nosso app, ficou muito mais rápido e prático chamar o seu.
          </p>

          {/* Search Bar */}
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
        </div>

        {/* Ad Carousel */}
        <div>
          <h2 className="text-foreground mb-3">Anúncios em Destaque</h2>
          <AdCarousel />
        </div>

        {/* Info Buttons */}
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

          {userType === 'driver' && (
            <Button 
              onClick={() => setShowStatusHelpModal(true)}
              variant="outline"
              className="h-auto py-3 px-4 flex items-center justify-start gap-3 border-blue-500/50 hover:bg-blue-500/10 sm:col-span-2"
            >
              <Radio className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="text-left">
                <div className="text-foreground text-sm">Como Usar o Status Online/Ausente</div>
                <div className="text-muted-foreground text-xs">Gerencie sua disponibilidade</div>
              </div>
            </Button>
          )}
        </div>

        {/* Featured Drivers */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <h2 className="text-foreground">Motoristas em Destaque</h2>
            {userType === 'passenger' && (
              <Button onClick={() => onNavigate('search')} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-9">
                Ver Todos
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 sm:gap-4">
            {filteredDrivers.length === 0 && (
              <div className="text-center py-10 col-span-full">Nenhum motorista encontrado.</div>
            )}
            {filteredDrivers.slice(0, 3).map(driver => (
              <Card key={driver._id || driver.email} className="shadow-sm hover:shadow-md transition-shadow bg-card border-border">
                <CardHeader className="px-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                      {driver.avatar ? (
                        <ImageWithFallback src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
                      ) : null}
                      {!driver.avatar && (
                        <AvatarFallback className="bg-green-600 text-white">
                          {driver.name.split(' ').map((n: any[]) => n[0]).join('')}
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
                        <Badge 
                          variant="secondary" 
                          className={`flex-shrink-0 text-xs sm:text-sm border-0 ${
                            driver.status === 'online' 
                              ? 'bg-green-600/20 text-green-400' 
                              : 'bg-gray-600/20 text-gray-400'
                          }`}
                        >
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
                    <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-sm">{driver.origin} → {driver.destination}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-xs sm:text-sm">{driver.availableDays}</span>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm">{driver.description}</p>
                  {userType === 'passenger' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-9"
                        onClick={() => {
                          if (onStartChat) {
                            onStartChat(driver._id || driver.id, driver.name, driver.avatar);
                          } else {
                            // fallback: navega para chat
                            onNavigate('chat');
                          }
                        }}
                      >
                        Solicitar Vaga
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (onStartChat) {
                            onStartChat(driver._id || driver.id, driver.name, driver.avatar);
                          } else {
                            onNavigate('chat');
                          }
                        }}
                        className="h-9 w-9"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Blog Preview */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
            <h2 className="text-foreground">Últimas Notícias</h2>
            <Button onClick={() => onNavigate('blog')} variant="outline" className="w-full sm:w-auto h-9">
              Ver Blog
            </Button>
          </div>

          {blogs.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhuma notícia disponível.</p>
          ) : (
            blogs.map((post) => {
              const preview = post.content.length > 120 
                ? post.content.slice(0, 120) + "..."
                : post.content;

              const date = new Date(post.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

              return (
                <Card key={post._id || post.title} className="shadow-sm bg-card border-border mb-3">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      
                      {/* Imagem da notícia */}
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                      />

                      {/* Conteúdo */}
                      <div className="flex-1">
                        <h3 className="text-foreground mb-1">{post.title}</h3>

                        <p className="text-muted-foreground text-sm mb-2">
                          {preview}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-blue-500 text-xs">{date}</span>
                          <span className="text-muted-foreground text-xs">Por {post.authorName}</span>
                        </div>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Second Ad Carousel */}
      <div className="p-4 pt-0">
        <AdCarousel />
      </div>

      <Footer onNavigate={onNavigate}/>
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

      {/* Modal: Como Usar Status Online/Ausente */}
      <Dialog open={showStatusHelpModal} onOpenChange={setShowStatusHelpModal}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Radio className="w-6 h-6 text-blue-500" />
              <DialogTitle className="text-foreground text-xl">Como Usar o Status Online/Ausente</DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Instruções sobre como gerenciar seu status de disponibilidade
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-500 text-xl">🟢</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-foreground">Status Online</h3>
                    <p className="text-sm text-muted-foreground">
                      Quando você está <strong className="text-green-500">Online</strong>, seu perfil aparece para os passageiros como disponível para novas viagens. Você receberá solicitações de corrida e os passageiros poderão entrar em contato diretamente com você.
                    </p>
                    <div className="bg-card rounded-md p-3 border border-border">
                      <p className="text-xs text-muted-foreground">💡 Melhor para: Horários de trabalho e quando você está pronto para aceitar corridas</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-500 text-xl">🟠</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-foreground">Status Ausente</h3>
                    <p className="text-sm text-muted-foreground">
                      Quando você está <strong className="text-orange-500">Ausente</strong>, seu perfil ainda aparece na lista, mas marcado como não disponível. Você <strong>não receberá</strong> novas solicitações de corrida, porém ainda pode continuar conversas ativas com passageiros.
                    </p>
                    <div className="bg-card rounded-md p-3 border border-border">
                      <p className="text-xs text-muted-foreground">💡 Melhor para: Pausas, refeições ou quando precisa finalizar corridas em andamento</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-500 text-xl">⚙️</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-foreground">Como Alterar seu Status</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Para mudar seu status de disponibilidade:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Acesse seu <strong>Perfil</strong> (clique no avatar no canto superior direito)</li>
                        <li>Encontre a seção <strong>"Status de Disponibilidade"</strong></li>
                        <li>Use os botões <strong>"Online"</strong> ou <strong>"Ausente"</strong> conforme necessário</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <ThumbsUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="text-foreground">💡 Dica Profissional</div>
                  <p className="text-sm text-muted-foreground">
                    Mantenha-se Online nos horários de maior movimento (manhã e tarde) para aumentar suas chances de receber mais corridas. Use o status Ausente apenas quando realmente não puder aceitar novas viagens.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <Button 
                onClick={() => setShowStatusHelpModal(false)} 
                className="w-full bg-blue-600 hover:bg-blue-700"
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