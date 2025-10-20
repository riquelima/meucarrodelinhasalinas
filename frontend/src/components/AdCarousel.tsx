import { Card } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import type { CarouselApi } from "./ui/carousel";

export function AdCarousel() {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;

    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(intervalId);
  }, [api]);

  const ads = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1659490223871-bc0f2a794818?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcmVzdGF1cmFudCUyMGFkdmVydGlzaW5nfGVufDF8fHx8MTc2MDY2NTQyMnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Restaurante Sabor & Arte",
      description: "Almoço executivo com 20% de desconto",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1758403463317-56ae333c3f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwZ3lmJTIwYmFubmVyfGVufDF8fHx8MTc2MDY2NTQyMnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Academia FitLife",
      description: "Primeira semana grátis para novos alunos",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1713937186755-70c860d61049?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMHNhbGUlMjBiYW5uZXJ8ZW58MXx8fHwxNzYwNjEzMzcxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Shopping Center Plaza",
      description: "Mega liquidação de verão até 70% OFF",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1682956892295-4326f513272d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwYWR2ZXJ0aXNlbWVudHxlbnwxfHx8fDE3NjA2NjU0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Café Aroma & Sabor",
      description: "2 cafés pelo preço de 1 até as 10h",
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1655140141886-4d02a7b99b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwZ2FkZ2V0cyUyMGJhbm5lcnxlbnwxfHx8fDE3NjA2NjU0MjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "TechStore",
      description: "Lançamento: Novos smartphones com cashback",
    },
  ];

  return (
    <div className="w-full">
      <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {ads.map((ad) => (
            <CarouselItem key={ad.id}>
              <Card className="overflow-hidden shadow-sm border-border bg-card">
                <div className="relative h-40 sm:h-48 md:h-56">
                  <ImageWithFallback
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-white mb-1">{ad.title}</h3>
                        <p className="text-white/90 text-sm">{ad.description}</p>
                      </div>
                      <button className="flex-shrink-0 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
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