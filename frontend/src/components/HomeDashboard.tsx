import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Star, MapPin, Clock, Search, Car as CarIcon, MessageCircle, HandshakeIcon, ThumbsUp, Radio, Share2 } from "lucide-react";
import { AdCarousel } from "./AdCarousel";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { API_BASE_URL } from "../config/api";

interface HomeDashboardProps {
  onNavigate: (screen: string) => void;
  userType: 'passenger' | 'driver' | 'advertiser' | 'admin';
  onStartChat?: (userId: string, name: string, avatar?: string) => void;
}

function DriverCard({ driver, userType, onStartChat, onNavigate, index }: any) {
  const initials = driver.name.split(' ').map((n: string) => n[0]).join('');
  const isOnline = driver.status === 'online';

  return (
    <div className={`glass-card card-lift rounded-2xl p-5 animate-fade-in-up delay-${Math.min(index * 100, 400)}`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-semibold text-lg overflow-hidden"
            style={{ background: isOnline ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#374151,#1f2937)' }}
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
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold">{driver.avgRating}</span>
            <span className="text-slate-500 text-xs">({driver.totalReviews} avaliações)</span>
          </div>

          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2">
              <CarIcon className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-slate-400 text-xs">{driver.vehicle} · {driver.licensePlate}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span className="text-slate-400 text-xs">{driver.origin} → {driver.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="text-slate-500 text-xs">{driver.availableDays}</span>
            </div>
          </div>

          <p className="text-slate-500 text-xs line-clamp-1 mb-3">{driver.description}</p>

          {userType === 'passenger' && (
            <div className="flex gap-2">
              <button
                className="btn-gradient flex-1 h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                onClick={() => {
                  if (onStartChat) onStartChat(driver._id || driver.id, driver.name, driver.avatar);
                  else onNavigate('chat');
                }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Conversar
              </button>

              <button
                onClick={async () => {
                  const shareData = { title: "Motorista disponível", text: `Motorista ${driver.name} – Rota: ${driver.origin} → ${driver.destination}`, url: window.location.href };
                  if (navigator.share) {
                    try { await navigator.share(shareData); } catch { }
                  } else {
                    navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                    alert("Link copiado para a área de transferência!");
                  }
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all"
                title="Compartilhar"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
              </button>

              <button
                onClick={() => {
                  const phone = driver.number;
                  if (!phone) { alert("Este motorista não possui WhatsApp cadastrado."); return; }
                  const clean = phone.replace(/\D/g, "");
                  window.open(`https://wa.me/${clean}?text=${encodeURIComponent(`Olá ${driver.name}, Vim através do "Meu Carro de Linha", e gostaria de agendar uma viagem! \n ${window.location.href}`)}`, "_blank");
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
                title="WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-emerald-400 w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function HomeDashboard({ onNavigate, userType, onStartChat }: HomeDashboardProps) {
  const [showHowToCallModal, setShowHowToCallModal] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showStatusHelpModal, setShowStatusHelpModal] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState<any[]>([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/motoristas/profile-views/top`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error("Erro ao buscar motoristas");
        const data = await response.json();
        setDrivers(data); setFilteredDrivers(data);
      } catch { setDrivers([]); setFilteredDrivers([]); }
    };
    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/blogs/home`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        setBlogs(data);
      } catch { setBlogs([]); }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (!searchTerm) return setFilteredDrivers(drivers);
    const lower = searchTerm.toLowerCase();
    setFilteredDrivers(drivers.filter(d =>
      d.name.toLowerCase().includes(lower) || `${d.origin} → ${d.destination}`.toLowerCase().includes(lower)
    ));
  }, [searchTerm, drivers]);

  return (
    <div className="pt-16 min-h-screen" style={{ background: 'linear-gradient(175deg, #070b16 0%, #060910 100%)' }}>
      {/* Hero */}
      <div
        className="relative px-5 pt-12 pb-8 text-center overflow-hidden"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% -5%, rgba(37,99,235,0.2) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 80% 110%, rgba(124,58,237,0.12) 0%, transparent 55%),
            linear-gradient(175deg, #070b16 0%, #060910 100%)
          `
        }}
      >
        <div className="absolute top-6 left-1/4 w-40 h-40 bg-blue-600/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-28 h-28 bg-purple-600/6 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-3 animate-fade-in-up leading-tight"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.03em' }}
          >
            Seu Carro de Linha,{' '}
            <span className="gradient-text">na Palma da Mão</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mb-8 animate-fade-in-up delay-100 max-w-lg mx-auto leading-relaxed">
            Em nossa região, táxi sempre foi carro de linha. Agora, com o nosso app, ficou muito mais rápido e prático chamar o seu.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto animate-fade-in-up delay-150">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none z-10" />
            <input
              placeholder="Buscar rota ou motorista..."
              className="w-full h-14 pl-11 pr-4 rounded-2xl text-slate-200 placeholder-slate-600 text-sm input-glow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-12 max-w-2xl mx-auto space-y-8">
        {/* Ads */}
        <section>
          <div className="section-label mb-4">
            <h2 className="text-slate-200 font-semibold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>Anúncios em Destaque</h2>
          </div>
          <AdCarousel />
        </section>

        {/* Info buttons */}
        <section className={`grid gap-3 ${userType === 'driver' ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'} animate-fade-in-up delay-200`}>
          <button onClick={() => setShowHowToCallModal(true)} className="glass-card card-lift rounded-xl p-4 flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <CarIcon className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-slate-200 text-sm font-medium">Como Chamar um Carro</div>
              <div className="text-slate-500 text-xs">Veja o passo a passo</div>
            </div>
          </button>

          <button onClick={() => setShowTipsModal(true)} className="glass-card card-lift rounded-xl p-4 flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <HandshakeIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-slate-200 text-sm font-medium">Dicas de Boa Convivência</div>
              <div className="text-slate-500 text-xs">Aprenda as melhores práticas</div>
            </div>
          </button>

          {userType === 'driver' && (
            <button onClick={() => setShowStatusHelpModal(true)} className="glass-card card-lift rounded-xl p-4 flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Radio className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="text-slate-200 text-sm font-medium">Como Usar o Status</div>
                <div className="text-slate-500 text-xs">Gerencie sua disponibilidade</div>
              </div>
            </button>
          )}
        </section>

        {/* Featured Drivers */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div className="section-label">
              <h2 className="text-slate-200 font-semibold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>Motoristas em Destaque</h2>
            </div>
            {userType === 'passenger' && (
              <button onClick={() => onNavigate('search')} className="btn-gradient px-4 py-1.5 rounded-lg text-xs font-semibold">
                Ver Todos
              </button>
            )}
          </div>

          {filteredDrivers.length === 0 ? (
            <div className="glass-card rounded-2xl py-12 text-center">
              <p className="text-slate-500 text-sm">Nenhum motorista encontrado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDrivers.slice(0, 3).map((driver, i) => (
                <DriverCard key={driver._id || driver.email} driver={driver} userType={userType} onStartChat={onStartChat} onNavigate={onNavigate} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Blog */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <div className="section-label">
              <h2 className="text-slate-200 font-semibold text-base" style={{ fontFamily: "'Sora', sans-serif" }}>Últimas Notícias</h2>
            </div>
            <button onClick={() => onNavigate('blog')} className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
              Ver Blog →
            </button>
          </div>
          {blogs.length === 0 ? (
            <p className="text-slate-600 text-sm">Nenhuma notícia disponível.</p>
          ) : (
            <div className="space-y-3">
              {blogs.map((post) => {
                const preview = post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content;
                const date = new Date(post.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
                return (
                  <div key={post._id || post.title} className="glass-card card-lift rounded-xl p-4 flex gap-3">
                    <img src={post.image} alt={post.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-slate-200 text-sm font-semibold mb-1 line-clamp-1">{post.title}</h3>
                      <p className="text-slate-500 text-xs mb-2 line-clamp-2">{preview}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-400 text-[10px] font-medium">{date}</span>
                        <span className="text-slate-600 text-[10px]">Por {post.authorName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <AdCarousel />
      </div>

      <Footer />
      <ScrollToTop />

      {/* Modal: Como Chamar */}
      <Dialog open={showHowToCallModal} onOpenChange={setShowHowToCallModal}>
        <DialogContent className="bg-[#0c1220] border-[rgba(80,130,255,0.18)] max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <CarIcon className="w-4 h-4 text-yellow-400" />
              </div>
              <DialogTitle className="text-slate-100" style={{ fontFamily: "'Sora', sans-serif" }}>Como Chamar um Carro</DialogTitle>
            </div>
            <DialogDescription className="sr-only">Instruções passo a passo de como solicitar uma corrida</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {[
              { label: '1. Faça Login:', text: <>Para contatar um motorista, primeiro <button className="text-blue-400 underline" onClick={() => { setShowHowToCallModal(false); onNavigate('login'); }}>crie sua conta</button> ou faça o <button className="text-blue-400 underline" onClick={() => { setShowHowToCallModal(false); onNavigate('login'); }}>login</button>.</> },
              { label: '2. Escolha seu Motorista:', text: 'Na lista acima, clique em um motorista que esteja Online para uma corrida imediata.' },
              { label: '3. Chame no WhatsApp:', text: 'Use o botão "Agendar uma Viagem" para iniciar uma conversa direta com o motorista.' },
              { label: '4. Combine a Corrida:', text: 'Aceite o valor, o local de partida e o destino diretamente com o motorista. O pagamento é feito diretamente ao motorista.' },
            ].map((s) => (
              <div key={s.label} className="glass-card-light rounded-xl p-4">
                <p className="text-slate-300 text-sm"><span className="text-yellow-400 font-semibold mr-2">{s.label}</span>{s.text}</p>
              </div>
            ))}
            <button onClick={() => setShowHowToCallModal(false)} className="btn-gradient w-full h-11 rounded-xl text-sm font-semibold mt-2">Entendi</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Dicas */}
      <Dialog open={showTipsModal} onOpenChange={setShowTipsModal}>
        <DialogContent className="bg-[#0c1220] border-[rgba(80,130,255,0.18)] max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <HandshakeIcon className="w-4 h-4 text-emerald-400" />
              </div>
              <DialogTitle className="text-slate-100" style={{ fontFamily: "'Sora', sans-serif" }}>Dicas de Boa Convivência</DialogTitle>
            </div>
            <DialogDescription className="sr-only">Recomendações para uma experiência agradável</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {[
              { label: 'Respeito Mútuo:', text: 'O motorista é um profissional que presta um serviço público. Trate-o com a mesma cordialidade que você espera receber.' },
              { label: 'Cuidado com o Veículo:', text: 'O carro é o instrumento de trabalho do motorista. Evite bater a porta, não deixe lixo dentro dele.' },
              { label: 'Seja Pontual:', text: 'Combine um horário e local e esteja pronto. Isso ajuda o motorista a manter sua agenda.' },
              { label: 'Avalie o Serviço:', text: 'Após a corrida, volte ao seu painel e avalie o motorista. O seu feedback é importante para a comunidade.' },
            ].map((t) => (
              <div key={t.label} className="glass-card-light rounded-xl p-4">
                <p className="text-slate-300 text-sm"><span className="text-emerald-400 font-semibold mr-2">{t.label}</span>{t.text}</p>
              </div>
            ))}
            <button onClick={() => setShowTipsModal(false)} className="w-full h-11 rounded-xl text-sm font-semibold mt-2" style={{ background: 'linear-gradient(135deg,#059669,#10b981)', color: '#fff' }}>Entendi</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Status */}
      <Dialog open={showStatusHelpModal} onOpenChange={setShowStatusHelpModal}>
        <DialogContent className="bg-[#0c1220] border-[rgba(80,130,255,0.18)] max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <Radio className="w-4 h-4 text-blue-400" />
              </div>
              <DialogTitle className="text-slate-100" style={{ fontFamily: "'Sora', sans-serif" }}>Como Usar o Status Online/Ausente</DialogTitle>
            </div>
            <DialogDescription className="sr-only">Instruções sobre como gerenciar seu status de disponibilidade</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="glass-card-light rounded-xl p-4 border border-emerald-500/20">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-emerald-500/15"><span className="text-lg">🟢</span></div>
                <div>
                  <h3 className="text-slate-200 font-semibold text-sm mb-1">Status Online</h3>
                  <p className="text-slate-400 text-xs">Quando você está <strong className="text-emerald-400">Online</strong>, seu perfil aparece para os passageiros como disponível para novas viagens.</p>
                </div>
              </div>
            </div>
            <div className="glass-card-light rounded-xl p-4 border border-orange-500/20">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-orange-500/15"><span className="text-lg">🟠</span></div>
                <div>
                  <h3 className="text-slate-200 font-semibold text-sm mb-1">Status Ausente</h3>
                  <p className="text-slate-400 text-xs">Quando você está <strong className="text-orange-400">Ausente</strong>, seu perfil ainda aparece na lista, mas marcado como não disponível.</p>
                </div>
              </div>
            </div>
            <div className="glass-card-light rounded-xl p-4 border border-blue-500/20">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-500/15"><span className="text-lg">⚙️</span></div>
                <div>
                  <h3 className="text-slate-200 font-semibold text-sm mb-1">Como Alterar seu Status</h3>
                  <ol className="text-slate-400 text-xs space-y-1 list-decimal list-inside">
                    <li>Acesse seu <strong>Perfil</strong></li>
                    <li>Encontre a seção <strong>"Status de Disponibilidade"</strong></li>
                    <li>Use os botões <strong>Online</strong> ou <strong>Ausente</strong></li>
                  </ol>
                </div>
              </div>
            </div>
            <div className="glass-card-light rounded-xl p-4 border border-emerald-500/15">
              <div className="flex gap-2">
                <ThumbsUp className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-slate-200 text-sm font-semibold mb-1">💡 Dica Profissional</div>
                  <p className="text-slate-400 text-xs">Mantenha-se Online nos horários de maior movimento (manhã e tarde) para aumentar suas chances de receber mais corridas.</p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowStatusHelpModal(false)} className="btn-gradient w-full h-11 rounded-xl text-sm font-semibold mt-2">Entendi</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}