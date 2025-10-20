import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { MapPin, Calendar, Users, MessageCircle, CheckCircle, Clock, TrendingUp, Radio, HelpCircle } from "lucide-react";
import { AdCarousel } from "./AdCarousel";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { useState } from "react";

interface DriverDashboardProps {
  onNavigate: (screen: string) => void;
}

export function DriverDashboard({ onNavigate }: DriverDashboardProps) {
  const [showStatusHelpModal, setShowStatusHelpModal] = useState(false);
  const passengers = [
    { id: 1, name: "Ana Costa", route: "Centro → Bairro Alto", date: "Segunda, 7h", status: "confirmed" },
    { id: 2, name: "Pedro Lima", route: "Centro → Bairro Alto", date: "Terça, 7h", status: "pending" },
    { id: 3, name: "Julia Mendes", route: "Zona Sul → Centro", date: "Quarta, 18h", status: "confirmed" },
    { id: 4, name: "Ricardo Souza", route: "Aeroporto → Centro", date: "Quinta, 15h", status: "pending" },
    { id: 5, name: "Mariana Silva", route: "Centro → Bairro Alto", date: "Sexta, 7h", status: "confirmed" },
  ];

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-green-500 mb-1">Solicitações</h1>
            <p className="text-muted-foreground text-sm">Gerencie as solicitações dos seus passageiros</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowStatusHelpModal(true)}
            className="shrink-0 border-green-500/30 hover:bg-green-500/10"
          >
            <HelpCircle className="w-5 h-5 text-green-500" />
          </Button>
        </div>

        {/* Ad Carousel */}
        <AdCarousel />

        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card className="shadow-sm bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="text-muted-foreground text-xs sm:text-sm mb-1">Viagens Feitas</div>
              <div className="text-green-500 text-sm sm:text-base flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                234
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="text-muted-foreground text-xs sm:text-sm mb-1">Passageiros</div>
              <div className="text-green-500 text-sm sm:text-base">28</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="text-muted-foreground text-xs sm:text-sm mb-1">Receita</div>
              <div className="text-green-500 text-sm sm:text-base">R$ 1.2k</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-foreground">Solicitações de Passageiros</h2>
            <Badge className="bg-orange-600/20 text-orange-400 border-0">
              {passengers.filter(p => p.status === 'pending').length} Pendentes
            </Badge>
          </div>
          
          {/* Mobile view - Cards */}
          <div className="block lg:hidden space-y-3">
            {passengers.map((passenger) => (
              <Card key={passenger.id} className="shadow-sm bg-card border-border">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-foreground">{passenger.name}</div>
                      <div className="text-muted-foreground text-xs mt-1">{passenger.route}</div>
                      <div className="text-muted-foreground text-xs mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {passenger.date}
                      </div>
                    </div>
                    {passenger.status === 'confirmed' ? (
                      <Badge className="bg-green-600/20 text-green-400 text-xs border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs bg-orange-600/20 text-orange-400 border-0">
                        <Clock className="w-3 h-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {passenger.status === 'pending' && (
                      <>
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 h-8 text-xs">
                          Aceitar
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs text-red-500 hover:text-red-600">
                          Recusar
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate('chat')}
                      className={`${passenger.status === 'pending' ? '' : 'flex-1'} h-8 text-xs`}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop view - Table */}
          <Card className="shadow-sm hidden lg:block bg-card border-border">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Passageiro</TableHead>
                    <TableHead>Rota</TableHead>
                    <TableHead>Data/Horário</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {passengers.map((passenger) => (
                    <TableRow key={passenger.id}>
                      <TableCell className="text-foreground">{passenger.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-green-500" />
                          {passenger.route}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {passenger.date}
                        </div>
                      </TableCell>
                      <TableCell>
                        {passenger.status === 'confirmed' ? (
                          <Badge className="bg-green-600/20 text-green-400 border-0">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Confirmado
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-600/20 text-orange-400 border-0">
                            <Clock className="w-3 h-3 mr-1" />
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {passenger.status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 text-xs">
                                Aceitar
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 text-xs text-red-500 hover:text-red-600">
                                Recusar
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onNavigate('chat')}
                            className="h-8"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-sm bg-card border-border border-l-4 border-l-green-500">
            <CardHeader className="p-4">
              <CardTitle className="text-green-500 text-base">Dicas para Motoristas</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Responda rapidamente às solicitações para aumentar suas chances de confirmação</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mantenha seu perfil atualizado com informações precisas sobre rotas e horários</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use o chat para combinar detalhes da viagem e esclarecer dúvidas dos passageiros</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-card border-border border-l-4 border-l-blue-500">
            <CardHeader className="p-4">
              <CardTitle className="text-blue-500 text-base">Como Usar o Status Online</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Online:</strong> Você aparece como disponível para os passageiros e pode receber novas solicitações</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span><strong>Ausente:</strong> Você não receberá novas solicitações, mas pode manter conversas ativas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Altere seu status em <strong>Perfil &gt; Status de Disponibilidade</strong></span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Second Ad Carousel */}
      <div className="p-4 pt-0">
        <AdCarousel />
      </div>
      
      <Footer />
      <ScrollToTop />

      {/* Modal: Como Usar Status Online/Ausente */}
      <Dialog open={showStatusHelpModal} onOpenChange={setShowStatusHelpModal}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Radio className="w-6 h-6 text-green-500" />
              <DialogTitle className="text-foreground text-xl">Como Usar o Status Online/Ausente</DialogTitle>
            </div>
            <DialogDescription className="sr-only">
              Instruções sobre como gerenciar seu status de disponibilidade
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3 text-sm">
              <p className="text-foreground">
                <span className="text-green-500 mr-2">🟢 Online:</span>
                Quando você está <strong>Online</strong>, seu perfil aparece para os passageiros como disponível para novas viagens. Você receberá solicitações de corrida e os passageiros poderão entrar em contato diretamente com você.
              </p>
              <p className="text-foreground">
                <span className="text-orange-500 mr-2">🟠 Ausente:</span>
                Quando você está <strong>Ausente</strong>, seu perfil ainda aparece na lista, mas marcado como não disponível. Você <strong>não receberá</strong> novas solicitações de corrida, porém ainda pode continuar conversas ativas com passageiros.
              </p>
              <p className="text-foreground">
                <span className="text-blue-500 mr-2">⚙️ Como Alterar:</span>
                Acesse seu <strong>Perfil</strong> (clique no seu avatar no canto superior direito) e use os botões <strong>"Online"</strong> ou <strong>"Ausente"</strong> na seção "Status de Disponibilidade" para mudar seu status a qualquer momento.
              </p>
              <p className="text-foreground">
                <span className="text-purple-500 mr-2">⏰ Agendamento Automático:</span>
                Você também pode configurar o <strong>Agendamento Automático</strong> no seu perfil. Com ele, você define horários específicos para ficar automaticamente Online (por exemplo, das 7h às 19h em dias úteis). Isso facilita sua rotina!
              </p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
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
