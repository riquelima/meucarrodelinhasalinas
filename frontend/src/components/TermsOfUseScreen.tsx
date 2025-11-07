import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { FileText, Calendar, AlertCircle } from "lucide-react";
import { AdCarousel } from "./AdCarousel";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

interface TermsOfUseScreenProps {
  onNavigate: (screen: string) => void;
}

export function TermsOfUseScreen({ onNavigate }: TermsOfUseScreenProps) {
  return (
    <div className="pt-20">
      <div className="p-4 lg:p-6 xl:p-8 space-y-4 pb-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-foreground mb-1">Termos de Uso</h1>
          <p className="text-muted-foreground text-sm">Última atualização: 7 de novembro de 2025</p>
        </div>

        {/* Botão Voltar */}
        <button
          onClick={() => onNavigate('signup')}
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
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-foreground">Bem-vindo ao Meu Carro de Linha</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Leia atentamente nossos termos de uso antes de utilizar a plataforma
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <p className="text-foreground text-sm leading-relaxed">
              Ao acessar e utilizar a plataforma Meu Carro de Linha, você concorda com os presentes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços. 
              A plataforma conecta passageiros e motoristas em Salinas, facilitando o transporte compartilhado de forma segura e eficiente.
            </p>
          </CardContent>
        </Card>

        {/* Seções dos Termos */}
        <div className="grid grid-cols-1 gap-4">
          {/* 1. Aceitação dos Termos */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">1. Aceitação dos Termos</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Ao criar uma conta, acessar ou usar a plataforma Meu Carro de Linha, você reconhece que leu, 
                compreendeu e concorda em estar vinculado a estes Termos de Uso e à nossa Política de Privacidade.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor 
                imediatamente após a publicação na plataforma. O uso continuado após tais modificações constitui 
                aceitação dos novos termos.
              </p>
            </CardContent>
          </Card>

          {/* 2. Descrição do Serviço */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">2. Descrição do Serviço</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                O Meu Carro de Linha é uma plataforma digital que conecta passageiros que necessitam de transporte 
                com motoristas que oferecem serviços de carona em Salinas. A plataforma facilita a comunicação, 
                agendamento e pagamento entre as partes.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                <strong className="text-foreground">Importante:</strong> O Meu Carro de Linha atua como intermediário 
                tecnológico. Não somos uma empresa de transporte e não prestamos serviços de transporte diretamente. 
                Os motoristas são prestadores de serviço independentes.
              </p>
            </CardContent>
          </Card>

          {/* 3. Elegibilidade */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">3. Elegibilidade e Cadastro</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Para usar a plataforma, você deve:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Ter capacidade legal para celebrar contratos</li>
                <li>Fornecer informações verdadeiras, precisas e completas</li>
                <li>Manter suas informações atualizadas</li>
                <li>Ser residente ou estar localizado em Salinas</li>
              </ul>
              <Separator className="my-3 bg-border" />
              <p className="text-foreground text-sm leading-relaxed">
                <strong className="text-foreground">Motoristas</strong> devem adicionalmente:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Possuir CNH válida e apropriada para o veículo</li>
                <li>Ter veículo em boas condições de funcionamento</li>
                <li>Possuir seguro veicular válido</li>
                <li>Não ter antecedentes criminais graves</li>
              </ul>
            </CardContent>
          </Card>

          {/* 4. Conta de Usuário */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">4. Conta de Usuário</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Você é responsável por manter a confidencialidade de sua conta e senha. Você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Não compartilhar sua senha com terceiros</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                <li>Assumir total responsabilidade por todas as atividades em sua conta</li>
                <li>Fazer logout ao final de cada sessão em dispositivos compartilhados</li>
              </ul>
              <p className="text-foreground text-sm leading-relaxed mt-3">
                Reservamo-nos o direito de suspender ou encerrar sua conta se detectarmos atividade suspeita, 
                violação destes termos ou comportamento inadequado.
              </p>
            </CardContent>
          </Card>

          {/* 5. Regras de Uso */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">5. Regras de Conduta</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Ao usar o Meu Carro de Linha, você concorda em NÃO:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Usar a plataforma para fins ilegais ou não autorizados</li>
                <li>Assediar, abusar ou prejudicar outros usuários</li>
                <li>Fornecer informações falsas ou enganosas</li>
                <li>Tentar acessar dados de outros usuários sem permissão</li>
                <li>Interferir no funcionamento da plataforma</li>
                <li>Usar robôs, scripts ou ferramentas automatizadas</li>
                <li>Copiar, modificar ou distribuir conteúdo da plataforma</li>
                <li>Discriminar outros usuários por qualquer motivo</li>
              </ul>
            </CardContent>
          </Card>

          {/* 6. Pagamentos */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">6. Pagamentos e Tarifas</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Os valores das corridas são calculados com base em distância, tempo e demanda. A plataforma cobra 
                uma taxa de serviço sobre cada transação completada.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                Todos os pagamentos são processados através de métodos seguros. Você concorda em:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Pagar pelo serviço conforme combinado</li>
                <li>Usar apenas métodos de pagamento legítimos</li>
                <li>Não contestar cobranças legítimas</li>
                <li>Manter informações de pagamento atualizadas</li>
              </ul>
              <p className="text-foreground text-sm leading-relaxed mt-3">
                Reembolsos serão analisados caso a caso, seguindo nossa política de cancelamentos.
              </p>
            </CardContent>
          </Card>

          {/* 7. Cancelamentos */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">7. Política de Cancelamento</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                <strong className="text-foreground">Cancelamento pelo Passageiro:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2 mb-3">
                <li>Gratuito se feito até 5 minutos após a solicitação</li>
                <li>Taxa de cancelamento aplicável após este período</li>
                <li>Cancelamentos excessivos podem resultar em penalidades</li>
              </ul>
              <p className="text-foreground text-sm leading-relaxed">
                <strong className="text-foreground">Cancelamento pelo Motorista:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Deve justificar o cancelamento</li>
                <li>Taxa de cancelamento pode ser aplicada ao motorista</li>
                <li>Cancelamentos frequentes afetam a avaliação do motorista</li>
              </ul>
            </CardContent>
          </Card>

          {/* 8. Responsabilidades */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">8. Limitação de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <div className="flex gap-3 p-3 bg-yellow-600/10 border border-yellow-600/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-foreground text-sm leading-relaxed">
                    O Meu Carro de Linha não é responsável por:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                    <li>Acidentes, lesões ou danos durante as viagens</li>
                    <li>Comportamento de motoristas ou passageiros</li>
                    <li>Perda ou dano de objetos pessoais</li>
                    <li>Atrasos ou não comparecimento</li>
                    <li>Qualidade ou condi��ão dos veículos</li>
                    <li>Disputas entre usuários</li>
                  </ul>
                </div>
              </div>
              <p className="text-foreground text-sm leading-relaxed">
                Você reconhece que assume os riscos associados ao uso da plataforma e dos serviços de transporte. 
                Nossa responsabilidade é limitada ao valor máximo permitido por lei.
              </p>
            </CardContent>
          </Card>

          {/* 9. Propriedade Intelectual */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">9. Propriedade Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones, imagens, clipes de áudio, 
                downloads digitais e software, é propriedade do Meu Carro de Linha ou de seus fornecedores de conteúdo 
                e é protegido por leis de direitos autorais.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                Você não pode reproduzir, distribuir, modificar, criar trabalhos derivados, exibir publicamente, 
                executar publicamente, republicar, baixar, armazenar ou transmitir qualquer material sem autorização prévia.
              </p>
            </CardContent>
          </Card>

          {/* 10. Privacidade */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">10. Privacidade dos Dados</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Sua privacidade é importante para nós. Coletamos, usamos e compartilhamos seus dados conforme 
                descrito em nossa Política de Privacidade. Ao usar a plataforma, você concorda com o processamento 
                de seus dados conforme descrito.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                Para mais detalhes sobre como tratamos seus dados pessoais, consulte nossa 
                <span className="text-blue-600"> Política de Privacidade</span>.
              </p>
            </CardContent>
          </Card>

          {/* 11. Suspensão e Encerramento */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">11. Suspensão e Encerramento de Conta</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, por qualquer motivo, 
                incluindo, mas não se limitando a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground text-sm pl-2">
                <li>Violação destes Termos de Uso</li>
                <li>Comportamento fraudulento ou ilegal</li>
                <li>Múltiplas reclamações de outros usuários</li>
                <li>Avaliações consistentemente baixas</li>
                <li>Inatividade prolongada</li>
              </ul>
              <p className="text-foreground text-sm leading-relaxed mt-3">
                Você pode encerrar sua conta a qualquer momento através das configurações do aplicativo.
              </p>
            </CardContent>
          </Card>

          {/* 12. Alterações do Serviço */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">12. Modificações no Serviço</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Reservamo-nos o direito de modificar ou descontinuar, temporária ou permanentemente, o serviço 
                (ou qualquer parte dele) com ou sem aviso prévio. Não seremos responsáveis perante você ou 
                terceiros por qualquer modificação, suspensão ou descontinuação do serviço.
              </p>
            </CardContent>
          </Card>

          {/* 13. Lei Aplicável */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">13. Lei Aplicável e Jurisdição</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Estes Termos de Uso serão regidos e interpretados de acordo com as leis da República Federativa 
                do Brasil. Quaisquer disputas decorrentes destes termos serão submetidas à jurisdição exclusiva 
                dos tribunais de Salinas, Minas Gerais.
              </p>
            </CardContent>
          </Card>

          {/* 14. Disposições Gerais */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">14. Disposições Gerais</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Se qualquer disposição destes termos for considerada inválida ou inexequível, as demais 
                disposições permanecerão em pleno vigor e efeito. A falha em fazer valer qualquer direito 
                ou disposição não constituirá renúncia de tal direito ou disposição.
              </p>
              <p className="text-foreground text-sm leading-relaxed">
                Estes Termos de Uso constituem o acordo completo entre você e o Meu Carro de Linha em relação 
                ao uso da plataforma.
              </p>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-foreground">Contato</CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
              <p className="text-foreground text-sm leading-relaxed">
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="space-y-2 text-sm">
                <p className="text-foreground">
                  <strong>Email:</strong> <span className="text-blue-600">contato@meucarrodelinha.com.br</span>
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

      <Footer />
      <ScrollToTop />
    </div>
  );
}
