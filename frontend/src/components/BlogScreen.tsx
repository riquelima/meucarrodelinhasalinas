import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Calendar, User, Search, TrendingUp, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AdCarousel } from "./AdCarousel";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { useState } from "react";

export function BlogScreen() {
  const [selectedPost, setSelectedPost] = useState<typeof posts[0] | null>(null);
  
  const posts = [
    {
      id: 1,
      title: "O futuro da mobilidade urbana: Caronas inteligentes",
      excerpt: "Descubra como a tecnologia está transformando o transporte compartilhado nas grandes cidades e reduzindo o trânsito.",
      content: "A mobilidade urbana está passando por uma transformação significativa com o avanço da tecnologia. As plataformas de carona compartilhada estão revolucionando a forma como nos deslocamos nas cidades, oferecendo alternativas mais econômicas e sustentáveis ao transporte individual.\n\nCom o uso de aplicativos inteligentes, é possível conectar motoristas e passageiros de forma rápida e eficiente, otimizando rotas e reduzindo o tempo de viagem. Além disso, a carona compartilhada contribui para a redução do tráfego nas grandes cidades, diminuindo congestionamentos e melhorando a qualidade do ar.\n\nO futuro da mobilidade promete ainda mais inovações, com a integração de inteligência artificial para prever demandas, otimizar preços e melhorar a experiência do usuário. Em Salinas, o 'Meu Carro de Linha' está na vanguarda dessa revolução, conectando a comunidade local de forma simples e eficiente.",
      image: "https://images.unsplash.com/photo-1560789003-4cac18182115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc3BvcnRhdGlvbiUyMG5ld3N8ZW58MXx8fHwxNzYwNjY2MTE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Admin",
      date: "15 de outubro, 2025",
      category: "Tecnologia",
      views: 1243,
    },
    {
      id: 2,
      title: "Economia compartilhada: Como economizar com caronas",
      excerpt: "Entenda os benefícios econômicos de compartilhar viagens e como isso pode impactar seu orçamento mensal.",
      content: "Compartilhar caronas pode gerar uma economia significativa no orçamento mensal. Estudos mostram que passageiros regulares podem economizar até 70% em comparação com o uso de táxi convencional ou transporte por aplicativo.\n\nAlém da economia direta com transporte, há benefícios indiretos como a redução de gastos com manutenção de veículo próprio, estacionamento e combustível. Para motoristas, oferecer caronas regulares pode ajudar a cobrir os custos do veículo e gerar uma renda extra.\n\nO conceito de economia compartilhada vai além do aspecto financeiro - trata-se de otimizar recursos e criar uma rede de apoio na comunidade. Com o 'Meu Carro de Linha', você faz parte dessa transformação econômica e social em Salinas.",
      image: "https://images.unsplash.com/photo-1671654197419-e47e3ec35ce8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMG1vYmlsaXR5JTIwY2l0eXxlbnwxfHx8fDE3NjA2NjYxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Admin",
      date: "12 de outubro, 2025",
      category: "Finanças",
      views: 892,
    },
    {
      id: 3,
      title: "Dicas de segurança para motoristas e passageiros",
      excerpt: "Confira as melhores práticas para garantir uma viagem segura e confortável para todos os envolvidos.",
      content: "A segurança é fundamental em qualquer viagem compartilhada. Aqui estão algumas práticas essenciais:\n\nPara Passageiros:\n- Verifique as avaliações do motorista antes de solicitar uma carona\n- Compartilhe sua localização com amigos ou familiares\n- Sempre use o cinto de segurança\n- Confirme os dados do veículo e motorista antes de entrar\n\nPara Motoristas:\n- Mantenha seu veículo em boas condições\n- Dirija com atenção e respeite as leis de trânsito\n- Verifique o perfil dos passageiros\n- Mantenha o veículo limpo e confortável\n\nAmbos devem manter uma comunicação respeitosa e clara. Em caso de qualquer problema, utilize os canais de suporte da plataforma. Sua segurança é nossa prioridade!",
      image: "https://images.unsplash.com/photo-1698464795984-9da9eb4a99cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJwb29saW5nJTIwcmlkZXNoYXJlfGVufDF8fHx8MTc2MDY2NjExNnww&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Admin",
      date: "8 de outubro, 2025",
      category: "Segurança",
      views: 1567,
    },
    {
      id: 4,
      title: "Como ser um bom motorista de carona: 10 dicas essenciais",
      excerpt: "Aprenda as melhores práticas para oferecer um serviço de qualidade e receber avaliações positivas.",
      content: "Ser um motorista de carona de sucesso vai além de simplesmente dirigir. Aqui estão 10 dicas para se destacar:\n\n1. Seja pontual - Respeite o horário combinado\n2. Mantenha o veículo limpo e organizado\n3. Dirija com segurança e conforto\n4. Seja educado e cordial\n5. Respeite a privacidade dos passageiros\n6. Mantenha boa comunicação\n7. Conheça bem as rotas\n8. Tenha água e lenços disponíveis\n9. Respeite as preferências dos passageiros (música, ar-condicionado)\n10. Peça feedback para melhorar continuamente\n\nSeguindo essas práticas, você construirá uma boa reputação, receberá avaliações positivas e terá passageiros regulares. Lembre-se: cada viagem é uma oportunidade de criar uma experiência positiva!",
      image: "https://images.unsplash.com/photo-1560789003-4cac18182115?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc3BvcnRhdGlvbiUyMG5ld3N8ZW58MXx8fHwxNzYwNjY2MTE1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Admin",
      date: "5 de outubro, 2025",
      category: "Dicas",
      views: 723,
    },
    {
      id: 5,
      title: "Impacto ambiental: Caronas reduzem emissões de CO2",
      excerpt: "Veja como o transporte compartilhado contribui para um planeta mais sustentável e reduz a poluição.",
      content: "O transporte é um dos principais contribuintes para as emissões de gases de efeito estufa. Compartilhar caronas é uma das formas mais eficazes de reduzir nosso impacto ambiental.\n\nEstudos mostram que:\n- Cada carona compartilhada pode reduzir até 50% das emissões de CO2\n- Menos carros nas ruas significa menos congestionamento e poluição\n- A otimização de rotas reduz o consumo de combustível\n- Uma única carona compartilhada pode economizar até 2kg de CO2 por viagem\n\nAo escolher compartilhar sua viagem, você está fazendo uma escolha consciente pelo meio ambiente. Em Salinas, cada carona compartilhada através do 'Meu Carro de Linha' contribui para um futuro mais sustentável para nossa comunidade e planeta.",
      image: "https://images.unsplash.com/photo-1671654197419-e47e3ec35ce8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMG1vYmlsaXR5JTIwY2l0eXxlbnwxfHx8fDE3NjA2NjYxMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      author: "Admin",
      date: "1 de outubro, 2025",
      category: "Sustentabilidade",
      views: 1089,
    },
  ];

  const categories = ["Todos", "Tecnologia", "Finanças", "Segurança", "Dicas", "Sustentabilidade"];

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-foreground mb-1">Blog</h1>
          <p className="text-muted-foreground text-sm">Notícias, dicas e atualizações da plataforma</p>
        </div>

      {/* Ad Carousel */}
      <AdCarousel />

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar artigos..."
            className="pl-10 bg-input-background h-10 text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === "Todos" ? "default" : "outline"}
            size="sm"
            className={`flex-shrink-0 h-8 text-xs ${category === "Todos" ? "bg-blue-600 hover:bg-blue-700" : ""}`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Post */}
      <Card className="overflow-hidden shadow-sm bg-card border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative h-48 lg:h-full">
            <ImageWithFallback
              src={posts[0].image}
              alt={posts[0].title}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-3 left-3 bg-blue-600">{posts[0].category}</Badge>
          </div>
          <div className="p-4 lg:p-6">
            <div className="flex flex-wrap items-center gap-2 lg:gap-3 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>{posts[0].author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{posts[0].date}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>{posts[0].views} visualizações</span>
              </div>
            </div>
            <h2 className="text-foreground mb-2 text-lg lg:text-xl">{posts[0].title}</h2>
            <p className="text-muted-foreground text-sm mb-4">{posts[0].excerpt}</p>
            <Button onClick={() => setSelectedPost(posts[0])} className="bg-blue-600 hover:bg-blue-700 h-9">Ler mais</Button>
          </div>
        </div>
      </Card>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {posts.slice(1).map((post) => (
          <Card key={post.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card border-border">
            <div className="relative h-40 sm:h-48">
              <ImageWithFallback
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-2 left-2 bg-blue-600 text-xs">{post.category}</Badge>
            </div>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-foreground text-sm sm:text-base line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="text-xs line-clamp-2 mt-1">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span className="hidden sm:inline">{post.date}</span>
                  <span className="sm:hidden">{post.date.split(',')[0]}</span>
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
                onClick={() => setSelectedPost(post)}
              >
                Ler mais
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal for full post */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card">
          {selectedPost && (
            <>
              <DialogHeader>
                <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden mb-4 -mt-6">
                  <ImageWithFallback
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-blue-600">{selectedPost.category}</Badge>
                </div>
                <DialogTitle className="text-foreground text-xl sm:text-2xl">{selectedPost.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{selectedPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{selectedPost.date}</span>
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
            </>
          )}
        </DialogContent>
      </Dialog>
      </div>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
}
