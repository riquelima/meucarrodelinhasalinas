import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Star, MapPin, Clock, Phone, Car as CarIcon, Filter, Search } from "lucide-react";
import { AdCarousel } from "./AdCarousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface PassengerDashboardProps {
  onNavigate: (screen: string) => void;
  onStartChat?: (userId: string, userName: string, userAvatar?: string) => void;
}

export function PassengerDashboard({ onNavigate, onStartChat }: PassengerDashboardProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [departureFilter, setDepartureFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar motoristas
  useEffect(() => {
    async function fetchDrivers() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/users/motoristas`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Erro ao buscar motoristas");

        const data = await res.json();
        setDrivers(data || []);
        setFilteredDrivers(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDrivers();
  }, []);

  // Filtrar motoristas
  useEffect(() => {
    let filtered = drivers;

    if (departureFilter.trim()) {
      filtered = filtered.filter(driver =>
        driver.origin?.toLowerCase().includes(departureFilter.toLowerCase())
      );
    }

    if (destinationFilter.trim()) {
      filtered = filtered.filter(driver =>
        driver.destination?.toLowerCase().includes(destinationFilter.toLowerCase())
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(driver =>
        driver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${driver.origin} → ${driver.destination}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDrivers(filtered);
  }, [searchTerm, departureFilter, destinationFilter, drivers]);

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8">
        <div>
          <h1 className="text-blue-500 mb-1">Buscar Motoristas</h1>
          <p className="text-muted-foreground text-sm">Encontre motoristas disponíveis para sua rota</p>
        </div>

        {/* Ad Carousel */}
        <AdCarousel />

        {/* Input de pesquisa */}
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome ou rota..."
              className="pl-10 bg-input-background h-10 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter modal */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-foreground">Motoristas Disponíveis</h2>
          <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Filter className="w-4 h-4 mr-2" />
                Buscar Rotas
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground">Filtrar Rotas</DialogTitle>
                <DialogDescription>
                  Encontre motoristas que fazem sua rota (campos opcionais)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="departure">Ponto de Partida</Label>
                  <Input
                    id="departure"
                    placeholder="Ex: Centro, Zona Sul..."
                    value={departureFilter}
                    onChange={(e) => setDepartureFilter(e.target.value)}
                    className="bg-input-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    placeholder="Ex: Bairro Alto, Universidade..."
                    value={destinationFilter}
                    onChange={(e) => setDestinationFilter(e.target.value)}
                    className="bg-input-background"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDepartureFilter("");
                    setDestinationFilter("");
                  }}
                >
                  Limpar Filtros
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsFilterModalOpen(false)}
                >
                  Aplicar Filtros
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de motoristas */}
        <div className="grid grid-cols-1 gap-2 sm:gap-4">
          {loading ? (
            <div className="text-center py-10 col-span-full">Carregando motoristas...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10 col-span-full">{error}</div>
          ) : filteredDrivers.length === 0 ? (
            <div className="text-center py-10 col-span-full">Nenhum motorista encontrado.</div>
          ) : (
            filteredDrivers.map((driver: any) => (
              <Card
                key={driver._id || driver.email || Math.random()}
                className="shadow-sm hover:shadow-md transition-shadow bg-card border-border"
              >
                <CardHeader className="px-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                      {driver.avatar ? (
                        <ImageWithFallback
                          src={driver.avatar}
                          alt={driver.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                      {!driver.avatar && (
                        <AvatarFallback className="bg-green-600 text-white">
                          {driver.name?.split(" ").map((n: string) => n[0]).join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-foreground text-base sm:text-lg truncate">
                            {driver.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs sm:text-sm">{driver.avgRating || 0}</span>
                            <span className="text-muted-foreground text-xs sm:text-sm">
                              ({driver.totalReviews || 0} avaliações)
                            </span>
                          </CardDescription>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`flex-shrink-0 text-xs sm:text-sm border-0 ${
                            driver.status === "online"
                              ? "bg-green-600/20 text-green-400"
                              : "bg-gray-600/20 text-gray-400"
                          }`}
                        >
                          {driver.status === "online" ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  <div className="flex items-start gap-2">
                    <CarIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-sm">
                      {driver.vehicle} - {driver.licensePlate}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-sm">
                      {driver.origin} → {driver.destination}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-xs sm:text-sm">
                      {driver.availableDays || "Indefinido"}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-9"
                      onClick={() => {
                        if (onStartChat) {
                          onStartChat(driver._id || driver.id, driver.name, driver.avatar);
                        } else {
                          onNavigate('chat');
                        }
                      }}
                    >
                      Conversar com motorista
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const phoneNumber = driver.number;

                        if (!phoneNumber) {
                          alert("Este motorista não possui WhatsApp cadastrado.");
                          return;
                        }

                        const cleanNumber = phoneNumber.replace(/\D/g, "");

                        window.open(
                          `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
                            `Olá ${driver.name}, Vim através do "Meu Carro de Linha", e gostaria de agendar uma viagem! \n ${window.location.href}`
                          )}`,
                          "_blank"
                        );
                      }}
                      className="h-9 w-9"
                      title="WhatsApp"
                      aria-label="WhatsApp"
                    >
                      <FontAwesomeIcon icon={faWhatsapp} className="text-green-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
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
