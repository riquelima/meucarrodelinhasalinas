import { useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { LogIn, Search, Car as CarIcon, HandshakeIcon, Star, MapPin } from "lucide-react";
import { AdCarousel } from "./AdCarousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ScrollToTop } from "./ScrollToTop";

interface HomeVisitorDashboardProps {
  onNavigate: (screen: string) => void;
}

const MOCK_DRIVERS = [
  { _id: 'drv1', name: 'João Silva', avatar: '', avgRating: 4.9, totalReviews: 124, status: 'online', vehicle: 'Fiat Uno', licensePlate: 'ABC-1234', origin: 'Salvador', destination: 'Salinas de Margarida', number: '+55 31 9 0000-0000', availableDays: 'Seg - Sex', description: 'Motorista experiente e cordial.' },
  { _id: 'drv2', name: 'Maria Costa', avatar: '', avgRating: 4.8, totalReviews: 98, status: 'offline', vehicle: 'Chevrolet Onix', licensePlate: 'XYZ-9876', origin: 'Salinas (Centro)', destination: 'Santo Antônio de Jesus', number: '+55 31 9 1111-1111', availableDays: 'Seg - Dom', description: 'Sempre pontual e educada.' },
];

const MOCK_BLOGS = [
  { _id: 'b1', title: 'Novidades no aplicativo', content: 'Estamos lançando melhorias para tornar suas viagens mais seguras e rápidas.', image: '/assets/placeholder-blog.jpg', createdAt: new Date().toISOString(), authorName: 'Equipe' },
  { _id: 'b2', title: 'Dicas para viajar', content: 'Conheça boas práticas para aproveitar melhor seus trajetos conosco.', image: '/assets/placeholder-blog.jpg', createdAt: new Date().toISOString(), authorName: 'Equipe' },
];

function DriverCard({ driver, onNavigate, index }: { driver: any; onNavigate: (s: string) => void; index: number }) {
  const initials = driver.name.split(' ').map((n: string) => n[0]).join('');
  const isOnline = driver.status === 'online';
  return (
    <div
      className={`glass-card card-lift rounded-2xl p-5 animate-fade-in-up delay-${index * 100}`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-semibold text-lg overflow-hidden"
            style={{ background: isOnline ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #374151, #1f2937)' }}
          >
            {driver.avatar
              ? <ImageWithFallback src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
              : initials
            }
          </div>
          <div
            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0c1220] ${isOnline ? 'status-dot-online' : 'status-dot-offline'}`}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-slate-100 font-semibold text-base truncate" style={{ fontFamily: "'Sora', sans-serif" }}>
              {driver.name}
            </h3>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${isOnline
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                  : 'bg-slate-600/20 text-slate-500 border border-slate-600/20'
                }`}
            >
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
            <span className="text-yellow-400 text-xs font-semibold">{driver.avgRating}</span>
            <span className="text-slate-500 text-xs">({driver.totalReviews} avaliações)</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <CarIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-slate-400 text-xs">{driver.vehicle} · {driver.licensePlate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span className="text-slate-400 text-xs">{driver.origin} → {driver.destination}</span>
            </div>
          </div>

          <p className="text-slate-500 text-xs mt-2 line-clamp-1">{driver.description}</p>

          <button
            onClick={() => onNavigate('login')}
            className="mt-3 w-full btn-gradient h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
          >
            Conversar com motorista
          </button>
        </div>
      </div>
    </div>
  );
}

export function HomeVisitorDashboard({ onNavigate }: HomeVisitorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [blogs, setBlogs] = useState<any[]>(MOCK_BLOGS);
  const [showHowToCallModal, setShowHowToCallModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);

  const filteredDrivers = MOCK_DRIVERS.filter(d => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return d.name.toLowerCase().includes(lower) || `${d.origin} → ${d.destination}`.toLowerCase().includes(lower);
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blogs/home`);
        if (!res.ok) throw new Error('Erro ao buscar blogs');
        const data = await res.json();
        setBlogs(data);
      } catch {
        setBlogs(MOCK_BLOGS);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="pt-16 min-h-screen" style={{ background: 'linear-gradient(175deg, #070b16 0%, #060910 100%)' }}>
      {/* Hero Section */}
      <div
        className="relative px-5 pt-14 pb-10 text-center overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 90% 60% at 50% -5%, rgba(37,99,235,0.22) 0%, transparent 65%),
            radial-gradient(ellipse 55% 45% at 85% 105%, rgba(124,58,237,0.14) 0%, transparent 55%),
            linear-gradient(175deg, #070b16 0%, #060910 100%)
          `
        }}
      >
        {/* Decorative glows */}
        <div className="absolute top-8 left-1/4 w-48 h-48 bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 right-1/4 w-36 h-36 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 animate-fade-in"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-glow-pulse" />
            <span className="text-blue-400 text-xs font-medium">Plataforma de Agendamento de Viagens</span>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold mb-4 animate-fade-in-up leading-tight"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.03em' }}
          >
            Seu Carro de Linha,{' '}
            <span className="gradient-text">na Palma da Mão</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base mb-8 animate-fade-in-up delay-100 max-w-lg mx-auto leading-relaxed">
            Conheça o app e veja como é simples chamar um motorista na sua região.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto mb-6 animate-fade-in-up delay-150">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
            <input
              placeholder="Buscar rota ou motorista..."
              className="w-full h-14 pl-11 pr-4 rounded-2xl text-slate-200 placeholder-slate-600 text-sm input-glow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="animate-fade-in-up delay-200">
            <button
              onClick={() => onNavigate('login')}
              className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
            >
              Conheça o Meu Carro de Linha
              <LogIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-12 max-w-2xl mx-auto space-y-8">
        {/* Featured Ads */}
        <section className="animate-fade-in-up delay-200">
          <div className="section-label mb-4">
            <h2 className="text-slate-200 font-semibold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>
              Anúncios em Destaque
            </h2>
          </div>
          <AdCarousel />
        </section>

        {/* Info buttons */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in-up delay-300">
          <button
            onClick={() => setShowHowToCallModal(true)}
            className="glass-card card-lift rounded-xl p-4 flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <CarIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-slate-200 text-sm font-medium">Como Chamar um Carro</div>
              <div className="text-slate-500 text-xs">Veja o passo a passo</div>
            </div>
          </button>

          <button
            onClick={() => setShowTipsModal(true)}
            className="glass-card card-lift rounded-xl p-4 flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <HandshakeIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-slate-200 text-sm font-medium">Dicas de Boa Convivência</div>
              <div className="text-slate-500 text-xs">Aprenda as melhores práticas</div>
            </div>
          </button>
        </section>

        {/* Featured Drivers */}
        <section className="animate-fade-in-up delay-300">
          <div className="section-label mb-4">
            <h2 className="text-slate-200 font-semibold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>
              Motoristas em Destaque
            </h2>
          </div>
          <div className="space-y-3">
            {filteredDrivers.slice(0, 3).map((driver, i) => (
              <DriverCard key={driver._id} driver={driver} onNavigate={onNavigate} index={i} />
            ))}
          </div>
        </section>

        {/* Blog */}
        <section className="animate-fade-in-up delay-400">
          <div className="flex justify-between items-center mb-4">
            <div className="section-label">
              <h2 className="text-slate-200 font-semibold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>
                Últimas Notícias
              </h2>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
            >
              Ver Blog →
            </button>
          </div>
          <div className="space-y-3">
            {blogs.map((post) => {
              const preview = post.content && post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content;
              return (
                <div key={post._id} className="glass-card card-lift rounded-xl p-4 flex gap-3">
                  <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-200 text-sm font-semibold mb-1 line-clamp-1">{post.title}</h3>
                    <p className="text-slate-500 text-xs mb-2 line-clamp-2">{preview}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 text-[10px] font-medium">{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                      <span className="text-slate-600 text-[10px]">Por {post.authorName}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="animate-fade-in-up delay-500">
          <AdCarousel />
        </div>
      </div>

      <ScrollToTop />

      {/* Modal: Como Chamar */}
      <Dialog open={showHowToCallModal} onOpenChange={setShowHowToCallModal}>
        <DialogContent className="bg-[#0c1220] border-[rgba(80,130,255,0.18)] max-w-lg max-h-[80vh] overflow-y-auto backdrop-blur-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <CarIcon className="w-4 h-4 text-yellow-400" />
              </div>
              <DialogTitle className="text-slate-100" style={{ fontFamily: "'Sora', sans-serif" }}>Como Chamar um Carro</DialogTitle>
            </div>
            <DialogDescription className="sr-only">Instruções passo a passo de como solicitar uma corrida</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { num: '1', label: 'Faça Login:', text: (<>Para contatar um motorista, primeiro <button onClick={() => { setShowHowToCallModal(false); onNavigate('login'); }} className="text-blue-400 underline">crie sua conta</button> ou faça o <button onClick={() => { setShowHowToCallModal(false); onNavigate('login'); }} className="text-blue-400 underline">login</button>.</>), color: 'text-yellow-400' },
              { num: '2', label: 'Escolha seu Motorista:', text: 'Na lista acima, clique em um motorista que esteja Online para uma corrida imediata, ou agende com qualquer um mesmo Offline.', color: 'text-yellow-400' },
              { num: '3', label: 'Chame no WhatsApp:', text: 'Use o botão "Agendar uma Viagem" para iniciar uma conversa direta com o motorista.', color: 'text-yellow-400' },
              { num: '4', label: 'Combine a Corrida:', text: 'Aceite o valor, o local de partida e o destino diretamente com o motorista. O pagamento é feito diretamente ao motorista.', color: 'text-yellow-400' },
            ].map((step) => (
              <div key={step.num} className="glass-card-light rounded-xl p-4">
                <p className="text-slate-300 text-sm">
                  <span className={`${step.color} font-semibold mr-2`}>{step.num}. {step.label}</span>
                  {step.text}
                </p>
              </div>
            ))}
            <button onClick={() => setShowHowToCallModal(false)} className="btn-gradient w-full h-11 rounded-xl text-sm font-semibold mt-2">
              Entendi
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Dicas */}
      <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
        <DialogContent className="bg-[#0c1220] border-[rgba(80,130,255,0.18)] max-w-lg max-h-[80vh] overflow-y-auto backdrop-blur-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <HandshakeIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <DialogTitle className="text-slate-100" style={{ fontFamily: "'Sora', sans-serif" }}>Dicas de Boa Convivência</DialogTitle>
            </div>
            <DialogDescription className="sr-only">Recomendações para uma experiência agradável</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {[
              { label: 'Respeito Mútuo:', text: 'O motorista é um profissional que presta um serviço público. Trate-o com a mesma cordialidade que você espera receber.' },
              { label: 'Cuidado com o Veículo:', text: 'O carro é o instrumento de trabalho do motorista. Evite bater a porta, não deixe lixo dentro dele e cuide do seu se fosse seu.' },
              { label: 'Seja Pontual:', text: 'Combine um horário e local e esteja pronto. Isso ajuda o motorista a manter sua agenda e atender outros passageiros.' },
              { label: 'Avalie o Serviço:', text: 'Após a corrida, volte ao seu painel e avalie o motorista. O seu feedback é importante para a comunidade.' },
            ].map((tip) => (
              <div key={tip.label} className="glass-card-light rounded-xl p-4">
                <p className="text-slate-300 text-sm">
                  <span className="text-emerald-400 font-semibold mr-2">{tip.label}</span>
                  {tip.text}
                </p>
              </div>
            ))}
            <button onClick={() => setShowTipsModal(false)} className="w-full h-11 rounded-xl text-sm font-semibold mt-2"
              style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff' }}>
              Entendi
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HomeVisitorDashboard;
