import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";
import { jwtDecode } from "jwt-decode";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Plus, Eye, MousePointerClick, TrendingUp, Play, Pause } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AdCarousel } from "./AdCarousel";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { API_BASE_URL } from "../config/api";

interface AdvertiserDashboardProps {
  userId: string;
  onNavigate: (screen: string) => void;
}

interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function AdvertiserDashboard({ userId, onNavigate }: AdvertiserDashboardProps) {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateAdModalOpen, setIsCreateAdModalOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null);



  useEffect(() => {
    async function fetchAds() {
      try {

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }

        const decodedToken = jwtDecode<DecodedToken>(token);
        userId = decodedToken.sub;
        const response = await fetch(`${API_BASE_URL}/ads/my/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await response.json();
        setAds(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
        setAds([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, [userId]);

  const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
  //const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : "0.00";

  const handleCreateAd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreedToTerms) {
      alert("Por favor, aceite os termos de uso antes de criar um anúncio.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token de autenticação não encontrado.");
      return;
    }

    const decodedToken = jwtDecode<DecodedToken>(token);
    userId = decodedToken.sub;


    const formData = new FormData();
    const target = e.currentTarget as typeof e.currentTarget & {
      establishmentName: { value: string };
      category: { value: string };
      whatsapp: { value: string };
      description: { value: string };
    };

    if (!selectedFile || (selectedFile instanceof FileList && selectedFile.length === 0)) {
      setError('Imagem do anúncio é obrigatória');
      return;
    }

    const file = selectedFile instanceof FileList ? selectedFile[0] : selectedFile;

    formData.set('image', file);


    if (target.establishmentName.value) {
      formData.set('nameCompany', target.establishmentName.value);
    }
    else {
      setError('Nome da empresa é obrigatorio')
      return
    }

    if (selectedCategory) {
      formData.set('category', selectedCategory);
    }
    else {
      setError('Categoria do anuncio é obrigatorio')
      return
    }        

    if (target.whatsapp.value) {
      const formattedNumber = formatPhoneNumber(target.whatsapp.value);
      formData.set('numberPhone', formattedNumber);
    }
    else {
      setError('Numero de contato do anuncio é obrigatorio')
      return
    }

    if (target.description.value) {
      formData.set('description', target.description.value);
    }
    else {
      setError('Descricao do anuncio é obrigatorio')
      return
    }


    try {
      const response = await fetch(`${API_BASE_URL}/ads/${userId}/anuncios`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao criar o anúncio");

      const newAd = await response.json();
      setAds((prev) => [newAd, ...prev]);
      setIsCreateAdModalOpen(false);
      setAgreedToTerms(false);
      setError(null)
      setSelectedFile(null)
      target.reset();

    } catch (err) {
      console.error("Falha ao criar anúncio:", err);
      setError("Não foi possível criar o anúncio. Tente novamente.");
    }
  };



  const handleUpdateStatus = async (_id: string, status: boolean) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Token de autenticação não encontrado.");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/ads/${_id}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: status }),
      });

      if (!response.ok) {
        throw new Error("Falha ao atualizar status");
      }

      setAds(prevAds =>
        prevAds.map(p =>
          p._id === _id ? { ...p, isActive: status } : p
        )
      );

    } catch (error) {
      console.error("Não foi possível alterar o status do anúncio:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 2MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem válido.');
      return;
    }

    setError(null)
    setSelectedFile(file);
  }

  const handleEditAd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingAd) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token de autenticação não encontrado.");
      return;
    }

    const establishmentName = (document.getElementById("establishmentName") as HTMLInputElement)?.value.trim();
    const category = selectedCategory || editingAd.category;
    const whatsapp = (document.getElementById("whatsapp") as HTMLInputElement)?.value.trim();
    
    const description = (document.getElementById("description") as HTMLTextAreaElement)?.value.trim();
    const fileInput = document.getElementById("adImages") as HTMLInputElement;
    const image = fileInput?.files?.[0];

    const formData = new FormData();

    // adiciona só se mudou ou existir
    if (establishmentName && establishmentName !== editingAd.nameCompany)
      formData.append("nameCompany", establishmentName);

    if (category && category !== editingAd.category)
      formData.append("category", category);

    const formattedNumber = formatPhoneNumber(whatsapp);
    if (whatsapp && whatsapp !== editingAd.numberPhone)
      formData.append("numberPhone", formattedNumber);

    if (description && description !== editingAd.description)
      formData.append("description", description);

    if (image)
      formData.append("image", image);

    if ([...formData.keys()].length === 0) {
      setError("Nenhuma alteração detectada.");
      return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/ads/${editingAd._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Falha ao atualizar anúncio");

      const updatedAd = await response.json();

      setAds(prevAds =>
        prevAds.map(ad => (ad._id === editingAd._id ? updatedAd : ad))
      );

      setIsCreateAdModalOpen(false);
      setEditingAd(null);
      setIsEditing(false);
      setError("");
      setSelectedFile(null);

    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar o anúncio.");
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    if (digits.startsWith('55')) return digits;

    return `55${digits}`;
  };



  if (loading) {
    return <p className="p-4 text-muted-foreground">Carregando anúncios...</p>;
  }

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8">
        <div>
          <h1 className="text-purple-400 mb-1">Painel do Anunciante</h1>
          <p className="text-muted-foreground text-sm">Gerencie suas campanhas publicitárias</p>
        </div>

        {/* Ad Carousel */}
        <div>
          <div className="text-muted-foreground text-xs mb-2">Anúncios em destaque:</div>
          <AdCarousel />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          <Card className="shadow-sm bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-muted-foreground text-xs sm:text-sm">Campanhas</div>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-purple-400 text-sm sm:text-base">{ads.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm bg-card border-border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1">
                <div className="text-muted-foreground text-xs sm:text-sm">Cliques</div>
                <MousePointerClick className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-purple-400 text-sm sm:text-base">{totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Botão de Criar Anúncio */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-4">
          <h2 className="text-foreground">Minhas Campanhas</h2>
          <Dialog
            open={isCreateAdModalOpen}
            onOpenChange={(open: any) => {
              setIsCreateAdModalOpen(open);
              if (!open) {
                setEditingAd(null);
                setIsEditing(false);
                setError("");
              }
            }}
          >

            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-purple-400 hover:bg-purple-500">
                <Plus className="w-4 h-4 mr-2" />
                Criar Anúncio
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">{isEditing ? "Editar Anúncio" : "Criar Novo Anúncio"}</DialogTitle>
                <DialogDescription>Preencha as informações do seu anúncio</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateAd} className="space-y-4 py-4">
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="adImages">Imagem do Anúncio *</Label>
                    <Input id="adImages" type="file" accept="image/*" multiple className="bg-input-background" onChange={handleFileChange} />
                    <p className="text-xs text-muted-foreground">
                      Tamanho recomendado: 1200x628px
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="establishmentName">Nome do Estabelecimento *</Label>
                    <Input id="establishmentName" placeholder="Ex: Restaurante Sabor & Arte" className="bg-input-background" defaultValue={editingAd?.nameCompany || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria *</Label>
                    <Select onValueChange={setSelectedCategory} defaultValue={editingAd?.category || ""}>
                      <SelectTrigger className="bg-input-background">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Alimentação">Alimentação</SelectItem>
                        <SelectItem value="Saúde & Bem-estar">Saúde & Bem-estar</SelectItem>
                        <SelectItem value="Educação">Educação</SelectItem>
                        <SelectItem value="Compras">Compras</SelectItem>
                        <SelectItem value="Serviços">Serviços</SelectItem>
                        <SelectItem value="Entretenimento">Entretenimento</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp para Contato *</Label>
                    <Input id="whatsapp" type="tel" placeholder="(91) 98765-4321" className="bg-input-background" defaultValue={editingAd?.numberPhone || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" placeholder="Descreva seu estabelecimento ou promoção..." className="bg-input-background min-h-[100px]" defaultValue={editingAd?.description || ""} />
                  </div>
                  <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg border border-border">
                    <Checkbox id="terms" checked={agreedToTerms} onCheckedChange={(checked: any) => setAgreedToTerms(checked as boolean)} />
                    <div className="grid gap-1.5 leading-none">
                      <label htmlFor="terms" className="text-sm cursor-pointer">
                        Li e concordo com os{" "}
                        <button
                          type="button"
                          className="text-purple-400 underline hover:text-purple-500"
                          onClick={() => onNavigate("advertiser-terms")}
                        >
                          Termos de Uso
                        </button>
                        .
                      </label>
                      <p className="text-xs text-muted-foreground">É necessário aceitar os termos para publicar anúncios na plataforma.</p>
                    </div>
                  </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsCreateAdModalOpen(false); setAgreedToTerms(false); }}>Cancelar</Button>
                  <Button
                    type="submit"
                    className="bg-purple-400 hover:bg-purple-500"
                    disabled={!agreedToTerms}
                  >
                    {isEditing ? "Salvar Alterações" : "Criar Anúncio"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de anúncios */}
        {ads.length === 0 ? (
          <p className="text-muted-foreground mt-4">Você ainda não possui anúncios cadastrados.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 mt-4">
            {ads.map((ad) => (
              <Card key={ad._id} className="shadow-sm bg-card border-border">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-foreground text-base sm:text-lg flex-1">{ad.nameCompany}</CardTitle>
                    {ad.isActive ? (
                      <Badge className="bg-green-600/20 text-green-400 text-xs flex-shrink-0 border-0">
                        <Play className="w-3 h-3 mr-1" />
                        Ativo
                      </Badge>
                    ) :
                      (
                        <Badge className="bg-red-600/20 text-red-400 text-xs flex-shrink-0 border-0">
                          <Pause className="w-3 h-3 mr-1" />
                          Pausado
                        </Badge>
                      )}

                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">{ad.description}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-4 pt-0">
                  <div className="grid grid-cols-2 justify-between gap-3">
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Cliques</div>
                      <div className="text-foreground text-sm sm:text-base">{ad.views?.toLocaleString() ?? 0}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs mb-1">Categoria</div>
                      <div className="text-foreground text-sm sm:text-base">{ad.category}</div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 text-sm h-9"
                      onClick={() => {
                        setEditingAd(ad);
                        setIsEditing(true);
                        setIsCreateAdModalOpen(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-sm h-9"
                      onClick={() => handleUpdateStatus(ad._id, !ad.isActive)}
                    >
                      {ad.isActive ? 'Pausar' : 'Ativar'}
                    </Button>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Segundo Ad Carousel */}
      <div className="p-4 pt-0">
        <AdCarousel />
      </div>

      <Footer onNavigate={onNavigate}/>
      <ScrollToTop />
    </div>
  );
}
