import { useEffect, useState } from "react";
import { X, Send, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { API_BASE_URL } from "../config/api";

export function SupportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    if (open) {
      setEmail("");
      setMessage("");
      setStatus(null);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message }),
      });

      if (!response.ok) throw new Error();

      setStatus("success");
      setTimeout(() => onClose(), 1800);
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <Card className="relative w-full max-w-md bg-card border border-border shadow-xl animate-scale-in">

        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button>

        <CardHeader className="text-center space-y-1 p-6">
          <CardTitle className="text-foreground text-lg">Fale Conosco</CardTitle>
          <CardDescription className="text-sm">
            Nos envie sua dúvida e retornaremos em breve.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label className="text-sm">Seu e-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="bg-input-background h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Mensagem</Label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva sua dúvida..."
                className="w-full bg-input-background border border-border rounded-md p-3 text-sm h-24 resize-none"
                required
              />
            </div>

            <Button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar
                </>
              )}
            </Button>
          </form>

          {status === "success" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-green-600 text-sm">
              <CheckCircle className="w-5 h-5" /> Mensagem enviada com sucesso!
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="w-5 h-5" /> Falha ao enviar. Tente novamente.
            </div>
          )}
        </CardContent>

      </Card>
    </div>
  );
}
