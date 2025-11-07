import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Megaphone, Calendar, AlertTriangle, DollarSign, Target, FileCheck } from "lucide-react";
import { AdCarousel } from "./AdCarousel";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

interface AdvertiserTermsScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdvertiserTermsScreen({ onNavigate }: AdvertiserTermsScreenProps) {
  return (
    <div className="pt-20">
      <div className="p-4 lg:p-6 xl:p-8 space-y-4 pb-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-foreground mb-1">Termos de Uso para Anunciantes</h1>
          <p className="text-muted-foreground text-sm">Última atualização: 7 de novembro de 2025</p>
        </div>

        {/* Botão Voltar */}
        <button
          onClick={() => onNavigate('dashboard')}
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
              <div className="w-10 h-10 rounded-lg bg-purple-600/10 flex items-center justify-center flex-shrink-0">
                <Megaphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-foreground">Termos Específicos para Anunciantes</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Condições para veiculação de anúncios na plataforma Meu Carro de Linha
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <p className="text-foreground text-sm leading-relaxed mb-3">
              Estes Termos de Uso para Anunciantes complementam os Termos de Uso gerais da plataforma e se aplicam 
              especificamente a empresas, marcas e indivíduos que desejam anunciar no Meu Carro de Linha.
            </p>
            <p className="text-foreground text-sm leading-relaxed">
              Ao criar uma conta de anunciante e veicular anúncios em nossa plataforma, você concorda com todos 
              os termos aqui descritos, além dos Termos de Uso gerais e Política de Privacidade.
            </p>
          </CardContent>
        </Card>

        {/* Seções dos Termos */}
        <div className="grid grid-cols-1 gap-4">
          {/* 1. Definições */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">1. Definições</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Para os fins destes termos:
              </p>
              <ul className="space-y-2 text-foreground text-sm">
                <li>
                  <strong>"Anunciante"</strong> - Pessoa física ou jurídica que contrata espaços publicitários 
                  na plataforma
                </li>
                <li>
                  <strong>"Anúncio"</strong> - Conteúdo publicitário fornecido pelo Anunciante, incluindo 
                  imagens, textos, vídeos ou outros formatos
                </li>
                <li>
                  <strong>"Campanha"</strong> - Conjunto de anúncios com objetivos, orçamento e período definidos
                </li>
                <li>
                  <strong>"Impressão"</strong> - Exibição de um anúncio para um usuário
                </li>
                <li>
                  <strong>"Clique"</strong> - Interação do usuário com o anúncio
                </li>
                <li>
                  <strong>"CPM"</strong> - Custo por mil impressões
                </li>
                <li>
                  <strong>"CPC"</strong> - Custo por clique
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 2. Elegibilidade */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">2. Elegibilidade para Anunciar</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Para se tornar um anunciante, você deve:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Ter pelo menos 18 anos (pessoa física) ou ser uma empresa legalmente constituída</li>
                <li>Fornecer informações verdadeiras e completas sobre sua empresa/identidade</li>
                <li>Possuir CNPJ válido (para empresas) ou CPF (para profissionais autônomos)</li>
                <li>Ter um método de pagamento válido</li>
                <li>Concordar com todos os termos e políticas</li>
                <li>Não estar envolvido em atividades ilegais ou fraudulentas</li>
              </ul>
              <div className="p-3 bg-purple-600/5 border border-purple-600/20 rounded-lg mt-4">
                <p className="text-foreground text-sm leading-relaxed">
                  <strong>Nota:</strong> Reservamo-nos o direito de rejeitar ou remover anunciantes a qualquer 
                  momento, sem necessidade de justificativa.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 3. Criação de Anúncios */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-purple-600" />
                <CardTitle className="text-foreground">3. Criação e Aprovação de Anúncios</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div>
                <h4 className="text-foreground mb-2">3.1 Especificações Técnicas</h4>
                <p className="text-foreground text-sm leading-relaxed mb-2">
                  Os anúncios devem seguir as especificações técnicas:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                  <li><strong>Formato de imagem:</strong> JPG, PNG ou WebP</li>
                  <li><strong>Resolução mínima:</strong> 1200x628 pixels</li>
                  <li><strong>Tamanho máximo:</strong> 5MB por arquivo</li>
                  <li><strong>Proporção:</strong> 16:9 ou 1:1 (dependendo do formato)</li>
                  <li><strong>Texto na imagem:</strong> Máximo 20% da área</li>
                </ul>
              </div>

              <Separator className="bg-border" />

              <div>
                <h4 className="text-foreground mb-2">3.2 Processo de Aprovação</h4>
                <p className="text-foreground text-sm leading-relaxed mb-2">
                  Todos os anúncios passam por revisão antes da publicação:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                  <li>Análise geralmente concluída em até 24 horas úteis</li>
                  <li>Verificação de conformidade com políticas de conteúdo</li>
                  <li>Revisão de qualidade técnica</li>
                  <li>Validação de informações e links</li>
                </ul>
                <p className="text-muted-foreground text-xs mt-2">
                  Anúncios rejeitados receberão feedback com motivos e sugestões de correção.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 4. Políticas de Conteúdo */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <CardTitle className="text-foreground">4. Políticas de Conteúdo Proibido</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
                <p className="text-foreground text-sm leading-relaxed mb-2">
                  <strong className="text-red-600">É PROIBIDO anunciar:</strong>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Produtos/Serviços Ilegais</h4>
                  <p className="text-muted-foreground text-xs">
                    Drogas, armas, documentos falsos, pirataria, etc.
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Conteúdo Adulto</h4>
                  <p className="text-muted-foreground text-xs">
                    Nudez, pornografia, conteúdo sexual explícito
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Violência e Ódio</h4>
                  <p className="text-muted-foreground text-xs">
                    Incitação à violência, discurso de ódio, discriminação
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Fraudes e Golpes</h4>
                  <p className="text-muted-foreground text-xs">
                    Esquemas de pirâmide, promessas enganosas, phishing
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Produtos Perigosos</h4>
                  <p className="text-muted-foreground text-xs">
                    Explosivos, substâncias tóxicas, itens perigosos
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Informações Falsas</h4>
                  <p className="text-muted-foreground text-xs">
                    Fake news, desinformação, alegações médicas não verificadas
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Jogos de Azar</h4>
                  <p className="text-muted-foreground text-xs">
                    Cassinos online, apostas não regulamentadas
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Propriedade Intelectual</h4>
                  <p className="text-muted-foreground text-xs">
                    Uso não autorizado de marcas, logos ou conteúdo protegido
                  </p>
                </div>
              </div>

              <div className="p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                <h4 className="text-foreground mb-2">Conteúdo Restrito</h4>
                <p className="text-foreground text-sm leading-relaxed mb-2">
                  Os seguintes tipos de conteúdo requerem aprovação especial:
                </p>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm pl-2">
                  <li>Bebidas alcoólicas</li>
                  <li>Suplementos alimentares e produtos de saúde</li>
                  <li>Serviços financeiros</li>
                  <li>Conteúdo político ou religioso</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 5. Modelos de Cobrança */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <CardTitle className="text-foreground">5. Modelos de Cobrança e Pagamento</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div>
                <h4 className="text-foreground mb-2">5.1 Modelos Disponíveis</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-600/5 border border-blue-600/10 rounded-lg">
                    <h4 className="text-foreground mb-1">CPM (Custo por Mil Impressões)</h4>
                    <p className="text-foreground text-sm leading-relaxed mb-1">
                      Você paga por cada mil vezes que seu anúncio é exibido.
                    </p>
                    <p className="text-muted-foreground text-xs">
                      • Valor base: R$ 15,00 por 1000 impressões<br />
                      • Ideal para: Reconhecimento de marca
                    </p>
                  </div>

                  <div className="p-3 bg-green-600/5 border border-green-600/10 rounded-lg">
                    <h4 className="text-foreground mb-1">CPC (Custo por Clique)</h4>
                    <p className="text-foreground text-sm leading-relaxed mb-1">
                      Você paga apenas quando alguém clica no seu anúncio.
                    </p>
                    <p className="text-muted-foreground text-xs">
                      • Valor base: R$ 0,50 por clique<br />
                      • Ideal para: Conversões e tráfego direcionado
                    </p>
                  </div>

                  <div className="p-3 bg-purple-600/5 border border-purple-600/10 rounded-lg">
                    <h4 className="text-foreground mb-1">Pacotes Mensais</h4>
                    <p className="text-foreground text-sm leading-relaxed mb-1">
                      Planos com valores fixos e benefícios exclusivos.
                    </p>
                    <p className="text-muted-foreground text-xs">
                      • Básico: R$ 500/mês | Intermediário: R$ 1.200/mês | Premium: R$ 2.500/mês
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              <div>
                <h4 className="text-foreground mb-2">5.2 Condições de Pagamento</h4>
                <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                  <li>Pagamento antecipado para novos anunciantes</li>
                  <li>Crédito pré-pago deve ser adicionado antes do início da campanha</li>
                  <li>Faturamento mensal disponível após análise de crédito</li>
                  <li>Formas aceitas: Cartão de crédito, boleto, PIX, transferência bancária</li>
                  <li>Valores mínimos: R$ 100,00 para primeira campanha</li>
                  <li>Recargas automáticas disponíveis</li>
                </ul>
              </div>

              <Separator className="bg-border" />

              <div>
                <h4 className="text-foreground mb-2">5.3 Reembolsos</h4>
                <p className="text-foreground text-sm leading-relaxed">
                  Créditos não utilizados podem ser reembolsados mediante solicitação, deduzindo-se:
                </p>
                <ul className="list-disc list-inside space-y-1 text-foreground text-sm pl-2 mt-2">
                  <li>Taxa administrativa de 10%</li>
                  <li>Valores já gastos em campanhas ativas</li>
                  <li>Processamento em até 30 dias úteis</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 6. Desempenho e Relatórios */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">6. Métricas e Relatórios</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Fornecemos acesso a dashboard com métricas detalhadas:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Impressões totais e por período</li>
                <li>Cliques e taxa de cliques (CTR)</li>
                <li>Custo total e por ação</li>
                <li>Alcance e frequência</li>
                <li>Dados demográficos da audiência</li>
                <li>Horários de maior engajamento</li>
                <li>Relatórios exportáveis (PDF, Excel)</li>
              </ul>
              <p className="text-muted-foreground text-sm mt-3">
                <strong>Nota:</strong> Métricas são atualizadas a cada 1 hora. Relatórios finais são 
                disponibilizados 24 horas após o término da campanha.
              </p>
            </CardContent>
          </Card>

          {/* 7. Segmentação */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">7. Opções de Segmentação</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Segmente seus anúncios para alcançar o público certo:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Geográfica</h4>
                  <p className="text-muted-foreground text-xs">
                    Por bairro, região ou cidade (Salinas e região)
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Demográfica</h4>
                  <p className="text-muted-foreground text-xs">
                    Idade, gênero, renda estimada
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Comportamental</h4>
                  <p className="text-muted-foreground text-xs">
                    Frequência de uso, horários preferidos
                  </p>
                </div>

                <div className="p-3 bg-card-foreground/5 border border-border rounded-lg">
                  <h4 className="text-foreground mb-1 text-sm">Tipo de Usuário</h4>
                  <p className="text-muted-foreground text-xs">
                    Passageiros, motoristas ou ambos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 8. Responsabilidades do Anunciante */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-foreground">8. Responsabilidades e Garantias</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Como anunciante, você garante que:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Possui todos os direitos sobre o conteúdo do anúncio</li>
                <li>O anúncio não viola direitos de propriedade intelectual de terceiros</li>
                <li>As informações fornecidas são verdadeiras e precisas</li>
                <li>O produto/serviço anunciado está em conformidade com as leis</li>
                <li>Possui autorização para ofertar o produto/serviço</li>
                <li>Cumprirá todas as promessas feitas no anúncio</li>
              </ul>
              <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-lg mt-4">
                <p className="text-foreground text-sm leading-relaxed">
                  <strong className="text-red-600">Importante:</strong> Você é totalmente responsável pelo 
                  conteúdo dos anúncios e por quaisquer reclamações, danos ou perdas resultantes. 
                  O Meu Carro de Linha não se responsabiliza pelo conteúdo dos anúncios.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 9. Suspensão e Cancelamento */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">9. Suspensão e Cancelamento de Anúncios</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-4">
              <div>
                <h4 className="text-foreground mb-2">9.1 Suspensão por Nossa Parte</h4>
                <p className="text-foreground text-sm leading-relaxed mb-2">
                  Podemos suspender ou remover anúncios imediatamente se:
                </p>
                <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                  <li>Violarem estas políticas ou os Termos de Uso gerais</li>
                  <li>Recebermos múltiplas reclamações de usuários</li>
                  <li>Contiverem informações falsas ou enganosas</li>
                  <li>Houver suspeita de fraude</li>
                  <li>Houver falta de pagamento</li>
                </ul>
              </div>

              <Separator className="bg-border" />

              <div>
                <h4 className="text-foreground mb-2">9.2 Cancelamento pelo Anunciante</h4>
                <p className="text-foreground text-sm leading-relaxed">
                  Você pode cancelar campanhas a qualquer momento. Campanhas CPM/CPC serão pausadas 
                  imediatamente. Créditos não utilizados permanecem disponíveis para futuras campanhas 
                  ou podem ser reembolsados (sujeito a taxas).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 10. Limitação de Responsabilidade */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">10. Limitação de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                O Meu Carro de Linha não garante:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Número específico de impressões ou cliques</li>
                <li>Taxa de conversão ou resultados de vendas</li>
                <li>Disponibilidade ininterrupta da plataforma</li>
                <li>Alcance de público específico além da segmentação contratada</li>
              </ul>
              <p className="text-foreground text-sm leading-relaxed mt-3">
                Nossa responsabilidade máxima está limitada ao valor pago pela campanha específica que gerou 
                o problema. Não nos responsabilizamos por lucros cessantes ou danos indiretos.
              </p>
            </CardContent>
          </Card>

          {/* 11. Propriedade Intelectual */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">11. Direitos de Propriedade Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Ao enviar conteúdo para anúncios, você concede ao Meu Carro de Linha uma licença mundial, 
                não exclusiva, livre de royalties, para usar, reproduzir, modificar e exibir o conteúdo 
                pelo período da campanha.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                Você mantém todos os direitos sobre seu conteúdo. Podemos usar anúncios (anonimizados) 
                para fins de marketing da plataforma ou em portfólio de exemplos, salvo se você 
                solicitar expressamente a não utilização.
              </p>
            </CardContent>
          </Card>

          {/* 12. Alterações */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">12. Alterações nos Termos</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Podemos modificar estes termos a qualquer momento. Anunciantes serão notificados com 15 dias 
                de antecedência sobre mudanças significativas. O uso continuado após as alterações constitui 
                aceitação dos novos termos.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                Campanhas ativas no momento da mudança continuarão sob os termos originais até sua conclusão.
              </p>
            </CardContent>
          </Card>

          {/* 13. Lei Aplicável */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">13. Lei Aplicável e Foro</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Estes termos são regidos pelas leis da República Federativa do Brasil. Questões relacionadas 
                a publicidade seguem também as diretrizes do CONAR (Conselho Nacional de Autorregulamentação 
                Publicitária) e Código de Defesa do Consumidor.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                Fica eleito o foro de Salinas, Minas Gerais, para dirimir quaisquer questões decorrentes 
                destes termos.
              </p>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">Suporte para Anunciantes</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Para dúvidas sobre publicidade ou suporte para anunciantes:
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-foreground">
                  <strong>Email Comercial:</strong> <span className="text-purple-600">anuncie@meucarrodelinha.com.br</span>
                </p>
                <p className="text-foreground">
                  <strong>Email Suporte:</strong> <span className="text-purple-600">suporte-anunciantes@meucarrodelinha.com.br</span>
                </p>
                <p className="text-foreground">
                  <strong>Telefone:</strong> <span className="text-purple-600">(38) 3841-XXXX</span>
                </p>
                <p className="text-foreground">
                  <strong>WhatsApp Business:</strong> <span className="text-purple-600">(38) 99XXX-XXXX</span>
                </p>
                <p className="text-foreground">
                  <strong>Horário:</strong> Segunda a Sexta, 8h às 18h
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

      <Footer />
      <ScrollToTop />
    </div>
  );
}
