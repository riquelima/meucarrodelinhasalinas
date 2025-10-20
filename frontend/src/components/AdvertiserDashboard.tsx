import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Eye, MousePointerClick, TrendingUp, Play, Pause } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AdCarousel } from "./AdCarousel";
import { useState } from "react";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

interface AdvertiserDashboardProps {
  onNavigate: (screen: string) => void;
}

export function AdvertiserDashboard({ onNavigate }: AdvertiserDashboardProps) {
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const campaigns = [
    {
      id: 1,
      name: "Campanha de Verão 2025",
      status: "active",
      views: 12453,
      clicks: 834,
      budget: "R$ 500,00",
      spent: "R$ 387,00",
    },
    {
      id: 2,
      name: "Promoção Black Friday",
      status: "paused",
      views: 8721,
      clicks: 542,
      budget: "R$ 800,00",
      spent: "R$ 245,00",
    },
    {
      id: 3,
      name: "Lançamento Produto X",
      status: "active",
      views: 5634,
      clicks: 421,
      budget: "R$ 300,00",
      spent: "R$ 189,00",
    },
  ];

  const viewsData = [
    { name: "Seg", views: 2400, clicks: 180 },
    { name: "Ter", views: 1398, clicks: 120 },
    { name: "Qua", views: 3800, clicks: 290 },
    { name: "Qui", views: 3908, clicks: 310 },
    { name: "Sex", views: 4800, clicks: 380 },
    { name: "Sáb", views: 3490, clicks: 250 },
    { name: "Dom", views: 2890, clicks: 190 },
  ];

  const engagementData = [
    { name: "Jan", engagement: 65 },
    { name: "Fev", engagement: 72 },
    { name: "Mar", engagement: 68 },
    { name: "Abr", engagement: 81 },
    { name: "Mai", engagement: 88 },
    { name: "Jun", engagement: 95 },
  ];

  const handleCreateAd = () => {
    if (!agreedToTerms) {
      alert("Por favor, aceite os termos de uso antes de criar um anúncio.");
      return;
    }
    // Lógica de criação do anúncio
    setIsCreateAdModalOpen(false);
    setAgreedToTerms(false);
  };

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8">
        <div>
          <h1 className="text-purple-400 mb-1">Painel do Anunciante</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas campanhas publicitárias</p>
        </div>

        {/* Ad Carousel - Preview of active ads */}
        <div>
          <div className="text-muted-foreground text-xs mb-2">Seus anúncios em destaque:</div>
          <AdCarousel />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card className="shadow-sm bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-muted-foreground text-xs sm:text-sm">Campanhas</div>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-purple-400 text-sm sm:text-base">3</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-muted-foreground text-xs sm:text-sm">Visualizações</div>
                <Eye className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-purple-400 text-sm sm:text-base">26.8k</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-muted-foreground text-xs sm:text-sm">Cliques</div>
                <MousePointerClick className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-purple-400 text-sm sm:text-base">1.8k</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-muted-foreground text-xs sm:text-sm">Conversão</div>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-purple-400 text-sm sm:text-base">6.7%</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-foreground">Minhas Campanhas</h2>
            <Dialog open={isCreateAdModalOpen} onOpenChange={setIsCreateAdModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-purple-400 hover:bg-purple-500">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Anúncio
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Criar Novo Anúncio</DialogTitle>
                  <DialogDescription>Preencha as informações do seu anúncio</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="adImages">Imagens do Anúncio *</Label>
                    <Input 
                      id="adImages" 
                      type="file" 
                      accept="image/*"
                      multiple
                      className="bg-input-background"
                    />
                    <p className="text-xs text-muted-foreground">
                      Você pode selecionar múltiplas imagens. Tamanho recomendado: 1200x628px
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="establishmentName">Nome do Estabelecimento *</Label>
                    <Input 
                      id="establishmentName" 
                      placeholder="Ex: Restaurante Sabor & Arte" 
                      className="bg-input-background" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select>
                      <SelectTrigger className="bg-input-background">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Alimentação</SelectItem>
                        <SelectItem value="health">Saúde & Bem-estar</SelectItem>
                        <SelectItem value="education">Educação</SelectItem>
                        <SelectItem value="shopping">Compras</SelectItem>
                        <SelectItem value="services">Serviços</SelectItem>
                        <SelectItem value="entertainment">Entretenimento</SelectItem>
                        <SelectItem value="other">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp para Contato *</Label>
                    <Input 
                      id="whatsapp" 
                      type="tel" 
                      placeholder="(91) 98765-4321" 
                      className="bg-input-background" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição (Opcional)</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Descreva seu estabelecimento ou promoção..." 
                      className="bg-input-background min-h-[100px]"
                    />
                  </div>
                  
                  {/* Terms Agreement */}
                  <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg border border-border">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms"
                        className="text-sm cursor-pointer"
                      >
                        Li e concordo com os{" "}
                        <a 
                          href="#" 
                          className="text-purple-400 hover:underline"
                          onClick={(e) => {
                            e.preventDefault();
                            // Abrir modal de termos ou navegar para página de termos
                          }}
                        >
                          Termos de Uso para Anunciantes
                        </a>
                      </label>
                      <p className="text-xs text-muted-foreground">
                        É necessário aceitar os termos para publicar anúncios na plataforma.
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateAdModalOpen(false);
                      setAgreedToTerms(false);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="bg-purple-400 hover:bg-purple-500" 
                    onClick={handleCreateAd}
                    disabled={!agreedToTerms}
                  >
                    Criar Anúncio
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="shadow-sm bg-card border-border">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-foreground text-base sm:text-lg flex-1">{campaign.name}</CardTitle>
                    {campaign.status === 'active' ? (
                      <Badge className="bg-green-600/20 text-green-400 text-xs flex-shrink-0 border-0">
                        <Play className="w-3 h-3 mr-1" />
                        Ativa
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        <Pause className="w-3 h-3 mr-1" />
                        Pausada
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-4 pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Visualizações</div>
                      <div className="text-foreground text-sm sm:text-base">{campaign.views.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Cliques</div>
                      <div className="text-foreground text-sm sm:text-base">{campaign.clicks.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                      <span>Orçamento</span>
                      <span>{campaign.budget}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Gasto</span>
                      <span className="text-purple-400">{campaign.spent}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 text-sm h-9">
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-sm h-9"
                    >
                      {campaign.status === 'active' ? 'Pausar' : 'Ativar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Card className="shadow-sm bg-card border-border">
            <CardHeader className="p-4">
              <CardTitle className="text-foreground text-base">Visualizações e Cliques</CardTitle>
              <CardDescription className="text-xs">Últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="views" fill="#c084fc" name="Visualizações" />
                  <Bar dataKey="clicks" fill="#e9d5ff" name="Cliques" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-sm bg-card border-border">
            <CardHeader className="p-4">
              <CardTitle className="text-foreground text-base">Engajamento</CardTitle>
              <CardDescription className="text-xs">Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="#c084fc"
                    strokeWidth={2}
                    name="Taxa de Engajamento (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
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
    </div>
  );
}
