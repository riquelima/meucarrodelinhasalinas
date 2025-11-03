import { Card } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ExternalLink, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import type { CarouselApi } from "./ui/carousel";
import Loading from "../loading";
import ErrorPage from "../error";

interface Ad {
  _id: string;
  nameCompany: string;
  description: string;
  image?: string;
  numberPhone: string;
  isActive?: boolean;
}

export function AdCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch ads
  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3000/ads/random");
        if (!res.ok) throw new Error("Falha ao carregar anúncios");
        const data: Ad[] = await res.json();

        // Filtra apenas anúncios ativos
        const filtered = data.filter(ad => ad.isActive !== false);
        setAds(filtered);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, []);

  // Auto-scroll carousel aleatório
  useEffect(() => {
    if (!api || ads.length === 0) return;

    let shownAds: number[] = [];
    let lastIndex = -1;

    const intervalId = setInterval(() => {
      let nextIndex: number;

      if (ads.length > 15) {
        // Garante que o anúncio não se repita até mostrar todos
        if (shownAds.length === ads.length) shownAds = [];
        do {
          nextIndex = Math.floor(Math.random() * ads.length);
        } while (shownAds.includes(nextIndex) || nextIndex === lastIndex);
        shownAds.push(nextIndex);
      } else {
        // Apenas evita repetição direta
        do {
          nextIndex = Math.floor(Math.random() * ads.length);
        } while (nextIndex === lastIndex);
      }

      lastIndex = nextIndex;
      api.scrollTo(nextIndex);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [api, ads]);

  const handleClickAds = async (numberPhone: any, _id: any) => {
    try {
      await fetch(`http://localhost:3000/ads/${_id}/clicks`, {
        method: "PATCH",
      });

      window.open(
        `https://wa.me/${numberPhone}?text=${encodeURIComponent(
          "Olá, vi seu anúncio no Meu Carro de Linha!"
        )}`,
        "_blank"
      );
    } catch (error) {
      console.error("Erro ao registrar clique:", error);
      window.open(
        `https://wa.me/${numberPhone}?text=${encodeURIComponent(
          "Olá, vi seu anúncio no Meu Carro de Linha!"
        )}`,
        "_blank"
      );
    }
  }

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage error={new Error(error)} reset={() => setError(null)} />;

  if (ads.length === 0)
    return <p className="text-center text-muted-foreground">Nenhum anúncio disponível no momento.</p>;

  return (
    <div className="w-full">
      <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {ads.map((ad) => (
            <CarouselItem key={ad._id}>
              <Card className="overflow-hidden shadow-sm border-border bg-card">
                <div className="relative h-40 sm:h-48 md:h-56">
                  <ImageWithFallback
                    src={ad.image || "https://via.placeholder.com/600x400?text=An%C3%BAncio"}
                    alt={ad.nameCompany}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-white mb-1">{ad.nameCompany}</h3>
                        <p className="text-white/90 text-sm">{ad.description}</p>
                      </div>
                      <a
                        onClick={() => handleClickAds(ad.numberPhone, ad._id)}
                        className="flex-shrink-0 w-8 h-8 bg-green-500/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-green-600/80 transition-colors"
                        title="Conversar no WhatsApp"
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden sm:block">
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </div>
      </Carousel>
    </div>
  );
}
