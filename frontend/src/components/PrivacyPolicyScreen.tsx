import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Shield, Calendar, Lock, Eye, Database, UserCheck } from "lucide-react";
import { AdCarousel } from "./AdCarousel";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

interface PrivacyPolicyScreenProps {
  onNavigate: (screen: string) => void;
  userType?: 'passenger' | 'driver' | 'advertiser' | 'admin' | null;
}

export function PrivacyPolicyScreen({ onNavigate, userType }: PrivacyPolicyScreenProps) {
  return (
    <div className="pt-20">
      <div className="p-4 lg:p-6 xl:p-8 space-y-4 pb-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-foreground mb-1">Política de Privacidade</h1>
          <p className="text-muted-foreground text-sm">Última atualização: 7 de novembro de 2025</p>
        </div>

        {/* Botão Voltar */}
        <button
          onClick={() => userType!== null ? onNavigate('dashboard') : onNavigate('login')}
          className="text-blue-500 hover:underline text-sm"
        >
          Voltar
        </button>

        {/* Ad Carousel */}
        <AdCarousel />

        {/* Introdução */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-foreground">Seu Compromisso com a Privacidade</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Protegemos seus dados pessoais com seriedade e transparência
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <p className="text-foreground text-sm leading-relaxed mb-3">
              A privacidade dos usuários é fundamental para o Meu Carro de Linha. Esta Política de Privacidade 
              descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você 
              utiliza nossa plataforma de transporte compartilhado.
            </p>
            <p className="text-foreground text-sm leading-relaxed">
              Ao usar o Meu Carro de Linha, você concorda com as práticas descritas nesta política. 
              Recomendamos que você leia este documento atentamente e entre em contato conosco caso tenha dúvidas.
            </p>
          </CardContent>
        </Card>

        {/* Seções da Política */}
        <div className="grid grid-cols-1 gap-4">
          {/* 1. Informações que Coletamos */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-foreground">1. Informações que Coletamos</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div>
                <h4 className="text-foreground mb-2">1.1 Informações Fornecidas por Você</h4>
                <p className="text-foreground text-sm leading-relaxed mb-2">
                  Coletamos informações que você nos fornece diretamente ao:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                  <li><strong>Criar uma conta:</strong> Nome, email, telefone, CPF, data de nascimento</li>
                  <li><strong>Configurar seu perfil:</strong> Foto, endereço, preferências</li>
                  <li><strong>Para motoristas:</strong> CNH, dados do veículo, seguro, foto do veículo</li>
                  <li><strong>Métodos de pagamento:</strong> Dados de cartão de crédito, PIX</li>
                  <li><strong>Comunicação:</strong> Mensagens, avaliações, comentários, reclamações</li>
                </ul>
              </div>

              <Separator className="bg-border" />

              <div>
                <h4 className="text-foreground mb-2">1.2 Informações Coletadas Automaticamente</h4>
                <p className="text-foreground text-sm leading-relaxed mb-2">
                  Quando você usa nossa plataforma, coletamos automaticamente:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                  <li><strong>Localização:</strong> GPS em tempo real durante corridas, origem e destino</li>
                  <li><strong>Dispositivo:</strong> Modelo, sistema operacional, identificadores únicos</li>
                  <li><strong>Uso:</strong> Histórico de corridas, horários, rotas, preferências</li>
                  <li><strong>Transações:</strong> Valores, datas, métodos de pagamento usados</li>
                  <li><strong>Logs:</strong> Endereço IP, tipo de navegador, páginas visitadas</li>
                </ul>
              </div>

              <Separator className="bg-border" />

              <div>
                <h4 className="text-foreground mb-2">1.3 Informações de Terceiros</h4>
                <p className="text-foreground text-sm leading-relaxed">
                  Podemos receber informações de serviços de terceiros, como processadores de pagamento, 
                  serviços de verificação de identidade, e plataformas de redes sociais (se você optar 
                  por conectá-las à sua conta).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 2. Como Usamos suas Informações */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-green-600" />
                <CardTitle className="text-foreground">2. Como Usamos suas Informações</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <p className="text-foreground text-sm leading-relaxed">
                Utilizamos suas informações pessoais para:
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-600/5 border border-blue-600/10 rounded-lg">
                  <h4 className="text-foreground mb-2">Fornecer e Melhorar o Serviço</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground text-sm pl-2">
                    <li>Conectar passageiros e motoristas</li>
                    <li>Processar pagamentos e transações</li>
                    <li>Calcular tarifas e rotas otimizadas</li>
                    <li>Fornecer suporte ao cliente</li>
                    <li>Melhorar funcionalidades da plataforma</li>
                  </ul>
                </div>

                <div className="p-3 bg-green-600/5 border border-green-600/10 rounded-lg">
                  <h4 className="text-foreground mb-2">Segurança e Prevenção de Fraudes</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground text-sm pl-2">
                    <li>Verificar identidade de usuários</li>
                    <li>Detectar e prevenir atividades fraudulentas</li>
                    <li>Investigar reclamações e disputas</li>
                    <li>Garantir conformidade com leis e regulamentos</li>
                  </ul>
                </div>

                <div className="p-3 bg-purple-600/5 border border-purple-600/10 rounded-lg">
                  <h4 className="text-foreground mb-2">Comunicação</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground text-sm pl-2">
                    <li>Enviar confirmações de corridas e recibos</li>
                    <li>Notificar sobre status de viagens</li>
                    <li>Responder suas dúvidas e solicitações</li>
                    <li>Enviar atualizações e novidades (se autorizado)</li>
                  </ul>
                </div>

                <div className="p-3 bg-yellow-600/5 border border-yellow-600/10 rounded-lg">
                  <h4 className="text-foreground mb-2">Análise e Pesquisa</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground text-sm pl-2">
                    <li>Analisar padrões de uso e tendências</li>
                    <li>Realizar pesquisas de satisfação</li>
                    <li>Desenvolver novos recursos</li>
                    <li>Criar relatórios estatísticos agregados</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Compartilhamento de Informações */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-foreground">3. Compartilhamento de Informações</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <p className="text-foreground text-sm leading-relaxed">
                Compartilhamos suas informações nas seguintes situações:
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="text-foreground mb-2">3.1 Entre Passageiros e Motoristas</h4>
                  <p className="text-foreground text-sm leading-relaxed">
                    Compartilhamos informações básicas (nome, foto, avaliação) entre passageiros e motoristas 
                    que são conectados para uma corrida. Durante a viagem, compartilhamos localização em tempo real.
                  </p>
                </div>

                <Separator className="bg-border" />

                <div>
                  <h4 className="text-foreground mb-2">3.2 Prestadores de Serviços</h4>
                  <p className="text-foreground text-sm leading-relaxed mb-2">
                    Compartilhamos com empresas terceirizadas que nos ajudam a operar, incluindo:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-foreground text-sm pl-2">
                    <li>Processadores de pagamento</li>
                    <li>Serviços de hospedagem em nuvem</li>
                    <li>Ferramentas de análise</li>
                    <li>Serviços de suporte ao cliente</li>
                    <li>Serviços de verificação de identidade</li>
                  </ul>
                </div>

                <Separator className="bg-border" />

                <div>
                  <h4 className="text-foreground mb-2">3.3 Requisitos Legais</h4>
                  <p className="text-foreground text-sm leading-relaxed">
                    Podemos divulgar suas informações se exigido por lei, ordem judicial, ou processo legal, 
                    ou se acreditarmos de boa-fé que tal divulgação é necessária para proteger direitos, 
                    propriedade ou segurança.
                  </p>
                </div>

                <Separator className="bg-border" />

                <div>
                  <h4 className="text-foreground mb-2">3.4 Transferências Comerciais</h4>
                  <p className="text-foreground text-sm leading-relaxed">
                    Em caso de fusão, aquisição ou venda de ativos, suas informações podem ser transferidas. 
                    Notificaremos você antes que suas informações sejam transferidas.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-red-600/5 border border-red-600/20 rounded-lg mt-4">
                <p className="text-foreground text-sm leading-relaxed">
                  <strong className="text-red-600">Importante:</strong> Nunca vendemos suas informações pessoais 
                  para terceiros para fins de marketing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Retenção de Dados */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">4. Retenção de Dados</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Mantemos suas informações pessoais pelo tempo necessário para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Fornecer nossos serviços</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Resolver disputas</li>
                <li>Fazer cumprir nossos acordos</li>
              </ul>
              <p className="text-foreground text-sm leading-relaxed mt-3">
                Após o encerramento de sua conta, retemos determinadas informações conforme exigido por lei, 
                geralmente por 5 anos para fins fiscais e regulatórios. Dados de localização em tempo real 
                são mantidos por até 6 meses, exceto quando necessário para investigações.
              </p>
            </CardContent>
          </Card>

          {/* 5. Segurança */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-green-600" />
                <CardTitle className="text-foreground">5. Segurança das Informações</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Implementamos medidas técnicas e organizacionais para proteger suas informações, incluindo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Criptografia de dados em trânsito (SSL/TLS) e em repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Auditorias regulares de segurança</li>
                <li>Treinamento de funcionários em privacidade</li>
                <li>Backups seguros e regulares</li>
              </ul>
              <div className="p-3 bg-yellow-600/5 border border-yellow-600/20 rounded-lg mt-4">
                <p className="text-foreground text-sm leading-relaxed">
                  <strong>Atenção:</strong> Nenhum sistema é 100% seguro. Embora tomemos medidas para proteger 
                  suas informações, não podemos garantir segurança absoluta. Você também deve tomar precauções, 
                  como manter sua senha segura.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 6. Seus Direitos */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">6. Seus Direitos de Privacidade</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <p className="text-foreground text-sm leading-relaxed">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Acesso</h4>
                  <p className="text-muted-foreground text-xs">
                    Solicitar cópia de suas informações pessoais
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Correção</h4>
                  <p className="text-muted-foreground text-xs">
                    Atualizar ou corrigir dados imprecisos
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Exclusão</h4>
                  <p className="text-muted-foreground text-xs">
                    Solicitar exclusão de suas informações
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Portabilidade</h4>
                  <p className="text-muted-foreground text-xs">
                    Receber seus dados em formato estruturado
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Oposição</h4>
                  <p className="text-muted-foreground text-xs">
                    Opor-se ao processamento de seus dados
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Revogação</h4>
                  <p className="text-muted-foreground text-xs">
                    Revogar consentimento a qualquer momento
                  </p>
                </div>
              </div>

              <p className="text-foreground text-sm leading-relaxed mt-4">
                Para exercer seus direitos, entre em contato através do email: 
                <span className="text-blue-600"> privacidade@meucarrodelinha.com.br</span>
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Responderemos à sua solicitação dentro de 15 dias úteis, conforme exigido pela LGPD.
              </p>
            </CardContent>
          </Card>

          {/* 7. Cookies e Tecnologias Similares */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">7. Cookies e Tecnologias Similares</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Usamos cookies e tecnologias similares para:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Manter você conectado à sua conta</li>
                <li>Lembrar suas preferências</li>
                <li>Entender como você usa a plataforma</li>
                <li>Melhorar funcionalidades</li>
                <li>Personalizar sua experiência</li>
              </ul>
              <p className="text-foreground text-sm leading-relaxed mt-3">
                Você pode gerenciar cookies através das configurações do seu navegador. No entanto, desabilitar 
                cookies pode afetar o funcionamento de algumas funcionalidades.
              </p>
            </CardContent>
          </Card>

          {/* 8. Localização */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">8. Dados de Localização</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Coletamos dados de localização para fornecer nossos serviços essenciais:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Conectar você com motoristas ou passageiros próximos</li>
                <li>Calcular tarifas e rotas</li>
                <li>Fornecer rastreamento em tempo real</li>
                <li>Melhorar a segurança e prevenção de fraudes</li>
              </ul>
              <div className="p-3 bg-blue-600/5 border border-blue-600/20 rounded-lg mt-4">
                <p className="text-foreground text-sm leading-relaxed">
                  <strong>Controle de Localização:</strong> Você pode desativar os serviços de localização nas 
                  configurações do dispositivo, mas isso impedirá o uso da plataforma para solicitar ou oferecer corridas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 9. Menores de Idade */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">9. Privacidade de Menores</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Nossos serviços são destinados a pessoas com 18 anos ou mais. Não coletamos intencionalmente 
                informações de menores de 18 anos. Se descobrirmos que coletamos inadvertidamente informações 
                de um menor, tomaremos medidas para excluir essas informações o mais rápido possível.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                Se você é pai/mãe ou responsável e acredita que seu filho nos forneceu informações pessoais, 
                entre em contato conosco imediatamente.
              </p>
            </CardContent>
          </Card>

          {/* 10. Alterações na Política */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">10. Alterações nesta Política</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas 
                práticas ou por razões legais. Notificaremos você sobre alterações significativas através do 
                aplicativo, email ou em destaque na plataforma.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                A data da "Última atualização" no topo desta política indica quando foi modificada pela última vez. 
                Recomendamos que você revise esta política periodicamente.
              </p>
            </CardContent>
          </Card>

          {/* 11. Lei Aplicável */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">11. Conformidade Legal</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Esta Política de Privacidade está em conformidade com:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</li>
                <li>Marco Civil da Internet (Lei nº 12.965/2014)</li>
                <li>Código de Defesa do Consumidor (Lei nº 8.078/1990)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contato e DPO */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">Encarregado de Proteção de Dados (DPO)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Para questões relacionadas à privacidade e proteção de dados, entre em contato com nosso 
                Encarregado de Proteção de Dados:
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-foreground">
                  <strong>Email:</strong> <span className="text-blue-600">privacidade@meucarrodelinha.com.br</span>
                </p>
                <p className="text-foreground">
                  <strong>Email DPO:</strong> <span className="text-blue-600">dpo@meucarrodelinha.com.br</span>
                </p>
                <p className="text-foreground">
                  <strong>Telefone:</strong> <span className="text-blue-600">(38) 3841-XXXX</span>
                </p>
                <p className="text-foreground">
                  <strong>Endereço:</strong> Salinas, Minas Gerais, Brasil
                </p>
              </div>
              <Separator className="my-4 bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Calendar className="w-4 h-4" />
                <span>Última atualização: 7 de novembro de 2025</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer onNavigate={onNavigate}/>
      <ScrollToTop />
    </div>
  );
}
