import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Calculator, Fuel, DollarSign, TrendingUp } from "lucide-react";
import { useState } from "react";
import { AdCarousel } from "./AdCarousel";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

interface RideCalculatorScreenProps {
  userType: 'passenger' | 'driver' | 'advertiser' | 'admin';
}

export function RideCalculatorScreen({ userType }: RideCalculatorScreenProps) {
  const [distance, setDistance] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [result, setResult] = useState<{
    fuelNeeded: number;
    fuelCost: number;
    suggestedPrice: number;
  } | null>(null);

  const getColor = () => {
    switch (userType) {
      case 'passenger': return 'bg-blue-600';
      case 'driver': return 'bg-green-600';
      case 'advertiser': return 'bg-purple-400';
      case 'admin': return 'bg-red-600';
    }
  };

  const getColorHover = () => {
    switch (userType) {
      case 'passenger': return 'hover:bg-blue-700';
      case 'driver': return 'hover:bg-green-700';
      case 'advertiser': return 'hover:bg-purple-500';
      case 'admin': return 'hover:bg-red-700';
    }
  };

  const getColorText = () => {
    switch (userType) {
      case 'passenger': return 'text-blue-500';
      case 'driver': return 'text-green-500';
      case 'advertiser': return 'text-purple-400';
      case 'admin': return 'text-red-500';
    }
  };

  const calculateRide = () => {
    const distanceNum = parseFloat(distance);
    const fuelPriceNum = parseFloat(fuelPrice);

    if (isNaN(distanceNum) || isNaN(fuelPriceNum) || distanceNum <= 0 || fuelPriceNum <= 0) {
      return;
    }

    // Média de consumo: 12 km/L
    const averageConsumption = 12;
    const fuelNeeded = distanceNum / averageConsumption;
    const fuelCost = fuelNeeded * fuelPriceNum;
    
    // Preço sugerido: custo do combustível + margem (200% para cobrir outros custos e lucro)
    const suggestedPrice = fuelCost * 3;

    setResult({
      fuelNeeded: parseFloat(fuelNeeded.toFixed(2)),
      fuelCost: parseFloat(fuelCost.toFixed(2)),
      suggestedPrice: parseFloat(suggestedPrice.toFixed(2))
    });
  };

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`${getColor()} p-3 rounded-xl`}>
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`${getColorText()}`}>Calculadora de Corrida</h1>
              <p className="text-muted-foreground text-sm">
                Estime os custos e o preço sugerido para uma viagem.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Card */}
        <Card className="shadow-sm bg-card border-border">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-foreground text-base lg:text-lg">Dados da Viagem</CardTitle>
            <CardDescription className="text-xs lg:text-sm">
              Preencha as informações abaixo para calcular
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="distance" className="text-sm">Distância da Viagem (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  step="0.1"
                  placeholder="Ex: 150"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="bg-input-background h-11 text-sm border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelPrice" className="text-sm">Preço do Combustível (R$/L)</Label>
                <Input
                  id="fuelPrice"
                  type="number"
                  step="0.01"
                  placeholder="Ex: 5.89"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  className="bg-input-background h-11 text-sm border-border"
                />
              </div>
            </div>

            <Button
              onClick={calculateRide}
              className={`w-full ${getColor()} ${getColorHover()} h-12`}
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calcular
            </Button>
          </CardContent>
        </Card>

        {/* Result Card */}
        {result && (
          <Card className="shadow-sm bg-card border-border border-l-4 border-l-green-500">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-green-500 text-base lg:text-lg">Resultado da Simulação</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div className="space-y-3">
                {/* Fuel Needed */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-600/20 p-2 rounded-lg">
                      <Fuel className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="text-foreground text-sm">Combustível Necessário:</span>
                  </div>
                  <span className="text-orange-500">{result.fuelNeeded} Litros</span>
                </div>

                {/* Fuel Cost */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600/20 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-foreground text-sm">Custo com Combustível:</span>
                  </div>
                  <span className="text-red-500">R$ {result.fuelCost.toFixed(2)}</span>
                </div>

                {/* Suggested Price */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-green-600/10 border-2 border-green-500/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-600/20 p-2 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <span className="text-foreground">Preço Sugerido da Corrida:</span>
                  </div>
                  <span className="text-green-500">R$ {result.suggestedPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-600/10 border border-blue-500/50 rounded-lg">
                <p className="text-muted-foreground text-xs lg:text-sm">
                  <span className="text-blue-500">💡 Dica:</span> O preço sugerido considera o custo do combustível
                  mais uma margem para cobrir outros custos (manutenção, desgaste do veículo) e lucro. 
                  Este é apenas um valor de referência, o preço final pode variar conforme sua negociação.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="shadow-sm bg-card border-border">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-foreground text-base lg:text-lg">Como Funciona o Cálculo?</CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="text-foreground">1. Consumo Médio:</span> O cálculo considera uma média de 12 km/L, 
                que é comum para veículos populares em condições urbanas.
              </p>
              <p>
                <span className="text-foreground">2. Custo do Combustível:</span> Multiplicamos os litros necessários 
                pelo preço que você informou.
              </p>
              <p>
                <span className="text-foreground">3. Preço Sugerido:</span> Calculamos um valor que cobre o combustível, 
                manutenção, desgaste do veículo e uma margem de lucro razoável.
              </p>
              <p className="text-yellow-500 text-xs">
                ⚠️ Lembre-se: Este é apenas um valor de referência. Considere também pedágios, estacionamento 
                e outros custos específicos da sua viagem.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Carousel */}
      <div className="p-4 pt-0 max-w-4xl mx-auto">
        <AdCarousel />
      </div>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
