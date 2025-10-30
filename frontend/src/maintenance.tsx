import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Car, Wrench } from "lucide-react";

export function MaintenanceScreen() {
  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg bg-card border-border text-center">
        <CardHeader className="text-center space-y-3 p-6">
          <CardTitle className="text-foreground text-2xl lg:text-3xl mt-4">Em Manutenção</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <Wrench className="w-16 h-16 text-blue-500 mx-auto" />
          <CardDescription className="text-base text-foreground/80">
            Estamos realizando ajustes importantes no momento para melhorar sua experiência.
          </CardDescription>
          <p className="text-muted-foreground text-sm">
            Pedimos desculpas pelo inconveniente. Por favor, tente novamente mais tarde.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Agradecemos a sua compreensão!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
