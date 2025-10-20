import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Star, MapPin, Clock, Phone, Car as CarIcon, Filter } from "lucide-react";
import { AdCarousel } from "./AdCarousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { useState } from "react";

interface PassengerDashboardProps {
  onNavigate: (screen: string) => void;
}

export function PassengerDashboard({ onNavigate }: PassengerDashboardProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [departureFilter, setDepartureFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const drivers = [
    {
      id: 1,
      name: "Carlos Silva",
      rating: 4.8,
      trips: 234,
      vehicle: "Honda Civic Prata",
      licensePlate: "ABC-1234",
      mainDeparture: "Centro",
      mainDestination: "Bairro Alto",
      route: "Centro → Bairro Alto",
      schedule: "Segunda a Sexta, 7h - 8h",
      price: "R$ 15,00",
      photo: "https://images.unsplash.com/photo-1718434127037-efa9c3043f7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcml2ZXIlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NjA2Mjc2NzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "online",
    },
    {
      id: 2,
      name: "Maria Santos",
      rating: 4.9,
      trips: 189,
      vehicle: "Toyota Corolla Branco",
      licensePlate: "XYZ-5678",
      mainDeparture: "Zona Sul",
      mainDestination: "Centro",
      route: "Zona Sul → Centro",
      schedule: "Segunda a Sexta, 6h30 - 7h30",
      price: "R$ 12,00",
      photo: "https://images.unsplash.com/photo-1755889308931-7083dce2a345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRyaXZlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MDcyNTkwMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "online",
    },
    {
      id: 3,
      name: "João Oliveira",
      rating: 4.7,
      trips: 156,
      vehicle: "Volkswagen Jetta Preto",
      licensePlate: "DEF-9012",
      mainDeparture: "Aeroporto",
      mainDestination: "Centro",
      route: "Aeroporto → Centro",
      schedule: "Todos os dias, 5h - 22h",
      price: "R$ 25,00",
      photo: "https://images.unsplash.com/photo-1758521962822-588389e13887?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBkcml2ZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYwNzI1OTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      status: "offline",
    },
  ];

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8">
        <div>
          <h1 className="text-blue-500 mb-1">Buscar Motoristas</h1>
          <p className="text-muted-foreground text-sm">Encontre motoristas disponíveis para sua rota</p>
        </div>

      {/* Ad Carousel */}
      <AdCarousel />

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
                <Label htmlFor="departure">Ponto de Partida Principal</Label>
                <Input 
                  id="departure" 
                  placeholder="Ex: Centro, Zona Sul..."
                  value={departureFilter}
                  onChange={(e) => setDepartureFilter(e.target.value)}
                  className="bg-input-background" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destino Principal</Label>
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

      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {drivers.map((driver) => (
          <Card key={driver.id} className="shadow-sm hover:shadow-md transition-shadow bg-card border-border">
            <CardHeader className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                  <ImageWithFallback
                    src={driver.photo}
                    alt={driver.name}
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className="bg-green-600 text-white">
                    {driver.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-foreground text-base sm:text-lg truncate">{driver.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                        <span className="text-xs sm:text-sm">{driver.rating}</span>
                        <span className="text-muted-foreground text-xs sm:text-sm">({driver.trips} viagens)</span>
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
                <CarIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-foreground text-sm">{driver.vehicle} - {driver.licensePlate}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-foreground text-sm">{driver.mainDeparture} → {driver.mainDestination}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-xs sm:text-sm">{driver.schedule}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm h-9">
                  Solicitar Vaga
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onNavigate('chat')}
                  className="h-9 w-9"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
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