import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Users, FileText, Megaphone, MessageSquare, Eye, MousePointerClick, Plus, Edit, Trash2, CheckCircle, XCircle, Filter } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

export function AdminDashboard() {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [isUserFilterModalOpen, setIsUserFilterModalOpen] = useState(false);
  const [isAdFilterModalOpen, setIsAdFilterModalOpen] = useState(false);
  const [isBlogFilterModalOpen, setIsBlogFilterModalOpen] = useState(false);

  const stats = [
    { label: "Total de Usuários", value: "1,234", change: "+12%", icon: Users, color: "text-blue-500" },
    { label: "Anúncios Ativos", value: "45", change: "+5%", icon: Megaphone, color: "text-purple-400" },
    { label: "Posts no Blog", value: "23", change: "+3", icon: FileText, color: "text-green-500" },
    { label: "Mensagens Recebidas", value: "87", change: "+18%", icon: MessageSquare, color: "text-orange-500" },
  ];

  const users = [
    { id: 1, name: "João Silva", email: "joao@email.com", type: "Passageiro", status: "active", joined: "Jan 2025" },
    { id: 2, name: "Maria Santos", email: "maria@email.com", type: "Motorista", status: "active", joined: "Jan 2025" },
    { id: 3, name: "Carlos Oliveira", email: "carlos@email.com", type: "Motorista", status: "active", joined: "Dez 2024" },
    { id: 4, name: "Ana Costa", email: "ana@email.com", type: "Passageiro", status: "suspended", joined: "Fev 2025" },
    { id: 5, name: "Pedro Lima", email: "pedro@email.com", type: "Anunciante", status: "active", joined: "Mar 2025" },
  ];

  const ads = [
    { id: 1, title: "Restaurante Sabor & Arte", advertiser: "Pedro Lima", status: "active", views: 12453, clicks: 834, budget: "R$ 500" },
    { id: 2, title: "Academia FitLife", advertiser: "Julia Mendes", status: "active", views: 8721, clicks: 542, budget: "R$ 800" },
    { id: 3, title: "Shopping Center Plaza", advertiser: "Ricardo Souza", status: "paused", views: 5634, clicks: 421, budget: "R$ 300" },
  ];

  const blogPosts = [
    { id: 1, title: "O futuro da mobilidade urbana", author: "Admin", status: "published", views: 1243, date: "15 Out 2025" },
    { id: 2, title: "Economia compartilhada", author: "Admin", status: "published", views: 892, date: "12 Out 2025" },
    { id: 3, title: "Dicas de segurança", author: "Admin", status: "draft", views: 0, date: "10 Out 2025" },
  ];

  const chartData = [
    { name: "Jan", usuarios: 120 },
    { name: "Fev", usuarios: 180 },
    { name: "Mar", usuarios: 250 },
    { name: "Abr", usuarios: 320 },
    { name: "Mai", usuarios: 410 },
    { name: "Jun", usuarios: 520 },
  ];

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8">
        <div>
          <h1 className="text-foreground mb-1">Painel Administrativo</h1>
          <p className="text-muted-foreground text-sm">Gerencie usuários, anúncios e conteúdo da plataforma</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-sm bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-muted-foreground text-xs mb-1">{stat.label}</div>
                      <div className="text-foreground text-xl sm:text-2xl mb-1">{stat.value}</div>
                      <div className="text-green-500 text-xs">{stat.change}</div>
                    </div>
                    <div className={`p-2 rounded-lg bg-muted`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Chart */}
        <Card className="shadow-sm bg-card border-border">
          <CardHeader className="p-4">
            <CardTitle className="text-foreground text-base">Crescimento de Usuários</CardTitle>
            <CardDescription className="text-xs">Últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                <YAxis stroke="#a1a1aa" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }} />
                <Line type="monotone" dataKey="usuarios" stroke="#3b82f6" strokeWidth={2} name="Usuários" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="w-full grid grid-cols-3 lg:w-auto bg-muted">
            <TabsTrigger value="users" className="text-xs sm:text-sm">Usuários</TabsTrigger>
            <TabsTrigger value="ads" className="text-xs sm:text-sm">Anúncios</TabsTrigger>
            <TabsTrigger value="blog" className="text-xs sm:text-sm">Blog</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-4 space-y-3">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-foreground text-base lg:text-lg">Gerenciar Usuários</h2>
              <div className="flex gap-2">
                <Dialog open={isUserFilterModalOpen} onOpenChange={setIsUserFilterModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-9">
                      <Filter className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Filtrar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Filtrar Usuários</DialogTitle>
                      <DialogDescription>Defina os critérios para filtrar a lista de usuários</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="filterUserType">Tipo de Usuário</Label>
                        <Select>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Todos os tipos" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="passenger">Passageiro</SelectItem>
                            <SelectItem value="driver">Motorista</SelectItem>
                            <SelectItem value="advertiser">Anunciante</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterUserStatus">Status</Label>
                        <Select>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Todos os status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="suspended">Suspenso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterUserDate">Data de Cadastro</Label>
                        <Select>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Qualquer data" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as datas</SelectItem>
                            <SelectItem value="today">Hoje</SelectItem>
                            <SelectItem value="week">Última semana</SelectItem>
                            <SelectItem value="month">Último mês</SelectItem>
                            <SelectItem value="year">Último ano</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterUserSearch">Buscar por nome ou email</Label>
                        <Input id="filterUserSearch" placeholder="Digite para buscar..." className="bg-input-background" />
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setIsUserFilterModalOpen(false)} className="w-full sm:w-auto">
                        Limpar Filtros
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" onClick={() => setIsUserFilterModalOpen(false)}>
                        Aplicar Filtros
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 h-9 text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Criar Novo Usuário</DialogTitle>
                    <DialogDescription>Preencha as informações do novo usuário</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="userName">Nome completo</Label>
                      <Input id="userName" placeholder="João Silva" className="bg-input-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">E-mail</Label>
                      <Input id="userEmail" type="email" placeholder="joao@email.com" className="bg-input-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userType">Tipo de Usuário</Label>
                      <Select>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passenger">Passageiro</SelectItem>
                          <SelectItem value="driver">Motorista</SelectItem>
                          <SelectItem value="advertiser">Anunciante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userPassword">Senha</Label>
                      <Input id="userPassword" type="password" className="bg-input-background" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUserModalOpen(false)}>Cancelar</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsUserModalOpen(false)}>Criar Usuário</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="block lg:hidden space-y-3">
              {users.map((user) => (
                <Card key={user.id} className="bg-card border-border">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-foreground">{user.name}</div>
                        <div className="text-muted-foreground text-xs mt-1">{user.email}</div>
                      </div>
                      {user.status === 'active' ? (
                        <Badge className="bg-green-600/20 text-green-400 text-xs border-0">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          <XCircle className="w-3 h-3 mr-1" />
                          Suspenso
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{user.type}</span>
                      <span>{user.joined}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs text-red-500 hover:text-red-600">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <Card className="shadow-sm hidden lg:block bg-card border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Membro desde</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-foreground">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.status === 'active' ? (
                            <Badge className="bg-green-600/20 text-green-400 border-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="w-3 h-3 mr-1" />
                              Suspenso
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{user.joined}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ads Tab */}
          <TabsContent value="ads" className="mt-4 space-y-3">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-foreground text-base lg:text-lg">Gerenciar Anúncios</h2>
              <div className="flex gap-2">
                <Dialog open={isAdFilterModalOpen} onOpenChange={setIsAdFilterModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-9">
                      <Filter className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Filtrar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Filtrar Anúncios</DialogTitle>
                      <DialogDescription>Defina os critérios para filtrar a lista de anúncios</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="filterAdStatus">Status</Label>
                        <Select>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Todos os status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="paused">Pausado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterAdViews">Visualizações Mínimas</Label>
                        <Input id="filterAdViews" type="number" placeholder="Ex: 1000" className="bg-input-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterAdClicks">Cliques Mínimos</Label>
                        <Input id="filterAdClicks" type="number" placeholder="Ex: 100" className="bg-input-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterAdBudget">Orçamento</Label>
                        <Select>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Qualquer orçamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="low">Até R$ 300</SelectItem>
                            <SelectItem value="medium">R$ 300 - R$ 600</SelectItem>
                            <SelectItem value="high">Acima de R$ 600</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterAdSearch">Buscar por título ou anunciante</Label>
                        <Input id="filterAdSearch" placeholder="Digite para buscar..." className="bg-input-background" />
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setIsAdFilterModalOpen(false)} className="w-full sm:w-auto">
                        Limpar Filtros
                      </Button>
                      <Button className="bg-purple-400 hover:bg-purple-500 w-full sm:w-auto" onClick={() => setIsAdFilterModalOpen(false)}>
                        Aplicar Filtros
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isAdModalOpen} onOpenChange={setIsAdModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-purple-400 hover:bg-purple-500 h-9 text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Criar Novo Anúncio</DialogTitle>
                    <DialogDescription>Configure um novo anúncio na plataforma</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="adTitle">Título do Anúncio</Label>
                      <Input id="adTitle" placeholder="Nome do estabelecimento" className="bg-input-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adAdvertiser">Anunciante</Label>
                      <Input id="adAdvertiser" placeholder="Nome do anunciante" className="bg-input-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adImage">Imagem do Anúncio</Label>
                      <Input id="adImage" type="file" accept="image/*" className="bg-input-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adBudget">Orçamento</Label>
                      <Input id="adBudget" placeholder="R$ 500,00" className="bg-input-background" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAdModalOpen(false)}>Cancelar</Button>
                    <Button className="bg-purple-400 hover:bg-purple-500" onClick={() => setIsAdModalOpen(false)}>Criar Anúncio</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {ads.map((ad) => (
                <Card key={ad.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-foreground truncate">{ad.title}</h3>
                          {ad.status === 'active' ? (
                            <Badge className="bg-green-600/20 text-green-400 text-xs flex-shrink-0 border-0">Ativo</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs flex-shrink-0">Pausado</Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground text-xs mb-2">Por {ad.advertiser}</div>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-blue-500" />
                            <span className="text-muted-foreground">{ad.views.toLocaleString()} visualizações</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MousePointerClick className="w-3 h-3 text-green-500" />
                            <span className="text-muted-foreground">{ad.clicks} cliques</span>
                          </div>
                          <div className="text-purple-400">{ad.budget}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs text-red-500">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog" className="mt-4 space-y-3">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-foreground text-base lg:text-lg">Gerenciar Blog</h2>
              <div className="flex gap-2">
                <Dialog open={isBlogFilterModalOpen} onOpenChange={setIsBlogFilterModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="h-9">
                      <Filter className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Filtrar</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Filtrar Postagens do Blog</DialogTitle>
                      <DialogDescription>Defina os critérios para filtrar as postagens</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="filterBlogStatus">Status</Label>
                        <Select>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Todos os status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                            <SelectItem value="draft">Rascunho</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterBlogAuthor">Autor</Label>
                        <Input id="filterBlogAuthor" placeholder="Nome do autor" className="bg-input-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterBlogDate">Data de Publicação</Label>
                        <Select>
                          <SelectTrigger className="bg-input-background">
                            <SelectValue placeholder="Qualquer data" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas as datas</SelectItem>
                            <SelectItem value="today">Hoje</SelectItem>
                            <SelectItem value="week">Última semana</SelectItem>
                            <SelectItem value="month">Último mês</SelectItem>
                            <SelectItem value="year">Último ano</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterBlogViews">Visualizações Mínimas</Label>
                        <Input id="filterBlogViews" type="number" placeholder="Ex: 500" className="bg-input-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="filterBlogSearch">Buscar por título</Label>
                        <Input id="filterBlogSearch" placeholder="Digite para buscar..." className="bg-input-background" />
                      </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                      <Button variant="outline" onClick={() => setIsBlogFilterModalOpen(false)} className="w-full sm:w-auto">
                        Limpar Filtros
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto" onClick={() => setIsBlogFilterModalOpen(false)}>
                        Aplicar Filtros
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isBlogModalOpen} onOpenChange={setIsBlogModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700 h-9 text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Nova Postagem</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">Criar Nova Postagem</DialogTitle>
                    <DialogDescription>Escreva um novo artigo para o blog</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="blogTitle">Título</Label>
                      <Input id="blogTitle" placeholder="Título do artigo" className="bg-input-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blogContent">Conteúdo</Label>
                      <Textarea id="blogContent" placeholder="Escreva o conteúdo do artigo..." className="bg-input-background min-h-[200px]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blogImage">Imagem de Capa</Label>
                      <Input id="blogImage" type="file" accept="image/*" className="bg-input-background" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blogStatus">Status</Label>
                      <Select>
                        <SelectTrigger className="bg-input-background">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="published">Publicar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsBlogModalOpen(false)}>Cancelar</Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsBlogModalOpen(false)}>Criar Postagem</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {blogPosts.map((post) => (
                <Card key={post.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-foreground truncate">{post.title}</h3>
                          {post.status === 'published' ? (
                            <Badge className="bg-green-600/20 text-green-400 text-xs flex-shrink-0 border-0">Publicado</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs flex-shrink-0">Rascunho</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span>Por {post.author}</span>
                          <span>{post.date}</span>
                          {post.status === 'published' && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{post.views} visualizações</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs text-red-500">
                          <Trash2 className="w-3 h-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
}
