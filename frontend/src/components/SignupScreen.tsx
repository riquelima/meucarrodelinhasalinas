import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Textarea } from "./ui/textarea";
import { Car, User, Users, Megaphone, Shield } from "lucide-react";
import { useState } from "react";

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
  onSignup: (userType: 'passenger' | 'driver' | 'advertiser' | 'admin') => void;
}

export function SignupScreen({ onNavigate, onSignup }: SignupScreenProps) {
  const [selectedUserType, setSelectedUserType] = useState<'passenger' | 'driver' | 'advertiser' | 'admin'>('passenger');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const userType = formData.get('userType') as 'passenger' | 'driver' | 'advertiser' | 'admin' || 'passenger';
    onSignup(userType);
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg max-h-[95vh] overflow-y-auto bg-card border-border">
        <CardHeader className="text-center space-y-3 p-4 lg:p-6">
          <div className="mx-auto w-14 h-14 lg:w-16 lg:h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Car className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
          </div>
          <CardTitle className="text-foreground text-xl lg:text-2xl">Criar Conta</CardTitle>
          <CardDescription className="text-sm">
            Junte-se à comunidade Meu Carro de Linha
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
            <div className="space-y-2 lg:space-y-3">
              <Label className="text-sm">Tipo de perfil</Label>
              <RadioGroup 
                defaultValue="passenger" 
                name="userType" 
                className="space-y-2"
                onValueChange={(value) => setSelectedUserType(value as 'passenger' | 'driver' | 'advertiser' | 'admin')}
              >
                <div className="flex items-center space-x-2 lg:space-x-3 p-2.5 lg:p-3 rounded-lg border border-border hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="passenger" id="passenger" />
                  <Label htmlFor="passenger" className="flex items-center gap-2 cursor-pointer flex-1 text-sm">
                    <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-500" />
                    </div>
                    <span>Passageiro</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3 p-2.5 lg:p-3 rounded-lg border border-border hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="driver" id="driver" />
                  <Label htmlFor="driver" className="flex items-center gap-2 cursor-pointer flex-1 text-sm">
                    <div className="w-7 h-7 lg:w-8 lg:h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-green-500" />
                    </div>
                    <span>Motorista</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-3 p-2.5 lg:p-3 rounded-lg border border-border hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="advertiser" id="advertiser" />
                  <Label htmlFor="advertiser" className="flex items-center gap-2 cursor-pointer flex-1 text-sm">
                    <div className="w-7 h-7 lg:w-8 lg:h-8 bg-purple-400/20 rounded-lg flex items-center justify-center">
                      <Megaphone className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-purple-400" />
                    </div>
                    <span>Anunciante</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="João Silva"
                className="bg-input-background h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="bg-input-background h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Celular</Label>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3">
                  <Input
                    id="countryCode"
                    type="tel"
                    placeholder="+55"
                    defaultValue="+55"
                    className="bg-input-background h-11 text-center"
                  />
                </div>
                <div className="col-span-3">
                  <Input
                    id="areaCode"
                    type="tel"
                    placeholder="91"
                    maxLength={2}
                    className="bg-input-background h-11 text-center"
                  />
                </div>
                <div className="col-span-6">
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="98765-4321"
                    className="bg-input-background h-11"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-input-background h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="bg-input-background h-11"
              />
            </div>
            
            {/* Driver-specific fields */}
            {selectedUserType === 'driver' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="vehicle" className="text-sm">Veículo</Label>
                  <Input
                    id="vehicle"
                    type="text"
                    placeholder="Ex: Honda Civic Prata"
                    className="bg-input-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate" className="text-sm">Placa do Veículo</Label>
                  <Input
                    id="licensePlate"
                    type="text"
                    placeholder="Ex: ABC-1234"
                    className="bg-input-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mainDeparture" className="text-sm">Ponto de Partida Principal</Label>
                  <Input
                    id="mainDeparture"
                    type="text"
                    placeholder="Ex: Centro"
                    className="bg-input-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mainDestination" className="text-sm">Destino Principal</Label>
                  <Input
                    id="mainDestination"
                    type="text"
                    placeholder="Ex: Bairro Alto"
                    className="bg-input-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleColor" className="text-sm">Cor do Veículo</Label>
                  <Input
                    id="vehicleColor"
                    type="text"
                    placeholder="Ex: Prata, Preto, Branco"
                    className="bg-input-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableSeats" className="text-sm">Vagas Disponíveis</Label>
                  <Input
                    id="availableSeats"
                    type="number"
                    min="1"
                    max="7"
                    placeholder="Ex: 3"
                    className="bg-input-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule" className="text-sm">Horário Principal</Label>
                  <Input
                    id="schedule"
                    type="text"
                    placeholder="Ex: 7h - 8h, Seg a Sex"
                    className="bg-input-background h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">Descrição (Opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Conte um pouco sobre você e seu serviço..."
                    className="bg-input-background min-h-[80px] resize-none"
                  />
                </div>
              </>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11">
              Criar conta
            </Button>
            <p className="text-muted-foreground text-xs text-center mt-3">
              Ao criar uma conta, você concorda com nossos{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Termos de Uso
              </a>
              {" "}e{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Política de Privacidade
              </a>
            </p>
          </form>
          <div className="mt-4 lg:mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              Já tem uma conta?{" "}
              <button
                onClick={() => onNavigate('login')}
                className="text-blue-500 hover:underline"
              >
                Entrar
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}