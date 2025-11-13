import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Calendar, User, Search, TrendingUp, Share2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AdCarousel } from "./AdCarousel";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

interface BlogScreenProps {
  onNavigate: (screen: string) => void;
}

export function BlogScreen({ onNavigate }: BlogScreenProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const categories = ["Todos", "tecnologia", "financas", "seguranca", "dicas", "sustentabilidade"];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          throw new Error("Não autorizado. Faça login novamente.");
        }

        if (!res.ok) throw new Error("Erro ao buscar posts");

        const data = (await res.json()).filter((blog: any) => blog.isPublished);
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (selectedCategory !== "Todos") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.content.toLowerCase().includes(term)
      );
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, searchTerm, posts]);

  if (loading) return <div className="text-center py-10">Carregando posts...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (posts.length === 0) return <div className="text-center py-10">Nenhum post encontrado.</div>;

  const handleAddView = async (post: any) => {
    setSelectedPost(post);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/blogs/${post._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao atualizar visualização");

      setPosts(prevPosts =>
        prevPosts.map(p =>
          p._id === post._id ? { ...p, views: (p.views || 0) + 1 } : p
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar visualização:", err);
    }
  };

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-foreground mb-1">Blog</h1>
          <p className="text-muted-foreground text-sm">Notícias, dicas e atualizações da plataforma</p>
        </div>

        <AdCarousel />

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar artigos..."
              className="pl-10 bg-input-background h-10 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`flex-shrink-0 h-8 text-xs ${
                selectedCategory === category ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        {filteredPosts[0] && (
          <Card className="overflow-hidden shadow-sm bg-card border-border">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-48 lg:h-full">
                <ImageWithFallback
                  src={filteredPosts[0].image}
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 left-3 bg-blue-600 capitalize">
                  {filteredPosts[0].category}
                </Badge>
              </div>
              <div className="p-4 lg:p-6">
                <div className="flex flex-wrap items-center gap-2 lg:gap-3 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{filteredPosts[0].authorName || "Admin"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(filteredPosts[0].createdAt).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{filteredPosts[0].views} visualizações</span>
                  </div>
                </div>
                <h2 className="text-foreground mb-2 text-lg lg:text-xl">
                  {filteredPosts[0].title}
                </h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                  {filteredPosts[0].content}
                </p>
                <Button
                  onClick={() => handleAddView(filteredPosts[0])}
                  className="bg-blue-600 hover:bg-blue-700 h-9"
                >
                  Ler mais
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredPosts.slice(1).map((post) => (
            <Card key={post._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card border-border">
              <div className="relative h-40 sm:h-48">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-blue-600 text-xs capitalize">
                  {post.category}
                </Badge>
              </div>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-foreground text-sm sm:text-base line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {post.content}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.createdAt).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.authorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{post.views}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs sm:text-sm"
                  onClick={() => handleAddView(post)}
                >
                  Ler mais
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal de leitura do post */}
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
            {selectedPost && (
              <>
                <DialogHeader>
                  {/* Carrossel */}
                  <Carousel className="w-full" opts={{ loop: true, autoScroll: 3000 }}>
                    <CarouselContent>
                      {[selectedPost.image, selectedPost.image2, selectedPost.image3]
                        .filter(Boolean)
                        .map((img, index) => (
                          <CarouselItem key={index}>
                            <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden">
                              <ImageWithFallback
                                src={img}
                                alt={`${selectedPost.title} - ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="hidden sm:block">
                      <CarouselPrevious className="-left-4" />
                      <CarouselNext className="-right-4" />
                    </div>
                  </Carousel>

                  <DialogTitle className="text-foreground text-xl sm:text-2xl mt-4">
                    {selectedPost.title}
                  </DialogTitle>

                  <DialogDescription>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{selectedPost.authorName || "Admin"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(selectedPost.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>{selectedPost.views} visualizações</span>
                      </div>
                    </div>
                  </DialogDescription>
                </DialogHeader>

                <div className="text-foreground text-sm sm:text-base leading-relaxed whitespace-pre-line mt-4">
                  {selectedPost.content}
                </div>

                {/* Botão de Compartilhar */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();

                      const shareUrl = `${window.location.origin}/blog/${selectedPost._id}`;
                      const shareData = {
                        title: selectedPost.title,
                        text: selectedPost.content.slice(0, 120) + "...",
                        url: shareUrl,
                      };

                      if (navigator.share) {
                        try {
                          await navigator.share(shareData);
                        } catch (error) {
                          console.log("Compartilhamento cancelado:", error);
                        }
                      } else {
                        navigator.clipboard.writeText(shareUrl);
                        alert("Link da notícia copiado!");
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-white" />
                      <span>Compartilhar notícia</span>
                    </div>
                  </button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        <Footer onNavigate={onNavigate} />
        <ScrollToTop />
      </div>
    </div>
  );
}
