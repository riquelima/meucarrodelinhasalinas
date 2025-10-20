import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Star, Car, TrendingUp, Award, Edit2, Camera, LogOut, Sun, Moon, Radio, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

interface ProfileScreenProps {
  userType: 'passenger' | 'driver' | 'advertiser' | 'admin';
  onLogout?: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

export function ProfileScreen({ userType, onLogout, theme, onThemeChange }: ProfileScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [autoScheduleEnabled, setAutoScheduleEnabled] = useState(false);
  const [schedules, setSchedules] = useState([
    { id: 1, day: 'Segunda a Sexta', startTime: '07:00', endTime: '08:00', enabled: true },
  ]);

  const addSchedule = () => {
    setSchedules([...schedules, { 
      id: Date.now(), 
      day: 'Segunda a Sexta', 
      startTime: '00:00', 
      endTime: '00:00', 
      enabled: true 
    }]);
  };

  const removeSchedule = (id: number) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const updateSchedule = (id: number, field: string, value: string | boolean) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const getColor = () => {
    switch (userType) {
      case 'passenger': return 'bg-blue-600';
      case 'driver': return 'bg-green-600';
      case 'advertiser': return 'bg-purple-400';
      case 'admin': return 'bg-red-600';
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

  const getColorBg = () => {
    switch (userType) {
      case 'passenger': return 'bg-blue-600/20';
      case 'driver': return 'bg-green-600/20';
      case 'advertiser': return 'bg-purple-400/20';
      case 'admin': return 'bg-red-600/20';
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'passenger': return 'Passageiro';
      case 'driver': return 'Motorista';
      case 'advertiser': return 'Anunciante';
      case 'admin': return 'Administrador';
    }
  };

  const stats = userType === 'passenger' 
    ? [
        { label: "Avaliação média", value: "4.9", icon: Star },
        { label: "Membro desde", value: "Jan 2024", icon: Award },
      ]
    : userType === 'driver'
    ? [
        { label: "Avaliação média", value: "4.8", icon: Star },
        { label: "Taxa de aceitação", value: "96%", icon: TrendingUp },
      ]
    : userType === 'admin'
    ? [
        { label: "Usuários gerenciados", value: "1.2k", icon: Car },
        { label: "Posts publicados", value: "23", icon: Star },
        { label: "Anúncios ativos", value: "45", icon: TrendingUp },
      ]
    : [
        { label: "Anúncios ativos", value: "3", icon: Car },
        { label: "Visualizações totais", value: "26.8k", icon: Star },
        { label: "Taxa de cliques", value: "6.7%", icon: TrendingUp },
      ];

  return (
    <div className="pt-20">
      <div className="p-4 space-y-4 pb-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`${getColorText()} mb-1`}>Meu Perfil</h1>
            <p className="text-muted-foreground text-sm">Gerencie suas informações pessoais</p>
          </div>
          {onLogout && (
            <Button
              onClick={onLogout}
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-600/10 border-red-500/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          )}
        </div>

      {/* Profile Header */}
      <Card className="shadow-sm bg-card border-border">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
            <div className="relative">
              <Avatar className="w-20 h-20 lg:w-24 lg:h-24">
                <AvatarFallback className={`${getColor()} text-white text-2xl lg:text-3xl`}>
                  JS
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button
                  type="button"
                  className={`absolute bottom-0 right-0 ${getColor()} rounded-full p-2 shadow-lg hover:opacity-90 transition-opacity`}
                >
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      // Handle file upload logic here
                      console.log(e.target.files);
                    }}
                  />
                </button>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-foreground mb-1 text-lg lg:text-xl">João Silva</h2>
              <p className="text-muted-foreground text-sm mb-2">joao.silva@email.com</p>
              <Badge className={`${getColorBg()} ${getColorText()} text-xs border-0`}>
                {getUserTypeLabel()}
              </Badge>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="w-full sm:w-auto h-9 text-sm border-border"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className={`grid gap-2 sm:gap-4 ${stats.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-sm bg-card border-border">
              <CardContent className="p-3 lg:p-6">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-3">
                  <div className={`${getColorBg()} p-2 lg:p-3 rounded-lg`}>
                    <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${getColorText()}`} />
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-muted-foreground text-xs mb-1 truncate">{stat.label}</div>
                    <div className={`${getColorText()} text-sm lg:text-base`}>{stat.value}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Profile Information */}
      <Card className="shadow-sm bg-card border-border">
        <CardHeader className="p-4">
          <CardTitle className="text-foreground text-base lg:text-lg">Informações Pessoais</CardTitle>
          <CardDescription className="text-xs lg:text-sm">Suas informações de cadastro</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <form className="space-y-3 lg:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm">Nome</Label>
                <Input
                  id="firstName"
                  defaultValue="João"
                  disabled={!isEditing}
                  className="bg-input-background h-10 text-sm border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm">Sobrenome</Label>
                <Input
                  id="lastName"
                  defaultValue="Silva"
                  disabled={!isEditing}
                  className="bg-input-background h-10 text-sm border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">E-mail</Label>
              <Input
                id="email"
                type="email"
                defaultValue="joao.silva@email.com"
                disabled={!isEditing}
                className="bg-input-background h-10 text-sm border-border"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Celular</Label>
              {isEditing ? (
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-3">
                    <Input
                      id="countryCode"
                      type="tel"
                      placeholder="+55"
                      defaultValue="+55"
                      className="bg-input-background h-10 text-center text-sm border-border"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      id="areaCode"
                      type="tel"
                      placeholder="91"
                      defaultValue="91"
                      maxLength={2}
                      className="bg-input-background h-10 text-center text-sm border-border"
                    />
                  </div>
                  <div className="col-span-6">
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="98765-4321"
                      defaultValue="98765-4321"
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                </div>
              ) : (
                <Input
                  defaultValue="+55 (91) 98765-4321"
                  disabled
                  className="bg-input-background h-10 text-sm border-border"
                />
              )}
            </div>
            {userType === 'driver' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="vehicle" className="text-sm">Veículo</Label>
                  <Input
                    id="vehicle"
                    defaultValue="Honda Civic Prata"
                    disabled={!isEditing}
                    className="bg-input-background h-10 text-sm border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate" className="text-sm">Placa do Veículo</Label>
                  <Input
                    id="licensePlate"
                    defaultValue="ABC-1234"
                    disabled={!isEditing}
                    className="bg-input-background h-10 text-sm border-border"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mainDeparture" className="text-sm">Ponto de Partida Principal</Label>
                    <Input
                      id="mainDeparture"
                      defaultValue="Centro"
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mainDestination" className="text-sm">Destino Principal</Label>
                    <Input
                      id="mainDestination"
                      defaultValue="Bairro Alto"
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleColor" className="text-sm">Cor do Veículo</Label>
                  <Input
                    id="vehicleColor"
                    defaultValue="Prata"
                    disabled={!isEditing}
                    className="bg-input-background h-10 text-sm border-border"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="availableSeats" className="text-sm">Vagas Disponíveis</Label>
                    <Input
                      id="availableSeats"
                      type="number"
                      defaultValue="3"
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule" className="text-sm">Horário Principal</Label>
                    <Input
                      id="schedule"
                      defaultValue="7h - 8h"
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm">Descrição</Label>
                  <Textarea
                    id="description"
                    defaultValue="Motorista profissional há mais de 10 anos. Sempre pontual e com carro limpo e confortável."
                    disabled={!isEditing}
                    className="bg-input-background min-h-[80px] resize-none text-sm border-border"
                  />
                </div>
              </>
            )}
            {userType === 'advertiser' && (
              <div className="space-y-2">
                <Label htmlFor="cnpj" className="text-sm">CNPJ</Label>
                <Input
                  id="cnpj"
                  defaultValue="12.345.678/0001-90"
                  disabled={!isEditing}
                  className="bg-input-background h-10 text-sm border-border"
                />
              </div>
            )}
            
            {/* Status Online - apenas para motoristas */}
            {userType === 'driver' && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm">Status de Disponibilidade</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setIsOnline(true)}
                      className={`flex-1 h-10 ${isOnline ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    >
                      <Radio className="w-4 h-4 mr-2" />
                      Online
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setIsOnline(false)}
                      className={`flex-1 h-10 ${!isOnline ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                    >
                      <Radio className="w-4 h-4 mr-2" />
                      Ausente
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isOnline ? 'Você está disponível para receber solicitações' : 'Você não receberá novas solicitações'}
                  </p>
                </div>

                {/* Agendamento Automático de Disponibilidade */}
                <div className="space-y-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Agendamento Automático</Label>
                      <p className="text-xs text-muted-foreground">
                        Configure horários para ficar online automaticamente
                      </p>
                    </div>
                    <Switch
                      checked={autoScheduleEnabled}
                      onCheckedChange={setAutoScheduleEnabled}
                    />
                  </div>

                  {autoScheduleEnabled && (
                    <div className="space-y-3 pt-2">
                      {schedules.map((schedule) => (
                        <Card key={schedule.id} className="shadow-sm bg-muted/50 border-border">
                          <CardContent className="p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-foreground">Horário {schedules.indexOf(schedule) + 1}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={schedule.enabled}
                                  onCheckedChange={(checked) => updateSchedule(schedule.id, 'enabled', checked)}
                                  disabled={!isEditing}
                                />
                                {schedules.length > 1 && isEditing && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeSchedule(schedule.id)}
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              <div className="space-y-1.5">
                                <Label className="text-xs text-muted-foreground">Dias da Semana</Label>
                                <Select
                                  value={schedule.day}
                                  onValueChange={(value) => updateSchedule(schedule.id, 'day', value)}
                                  disabled={!isEditing}
                                >
                                  <SelectTrigger className="bg-input-background h-9 text-sm border-border">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-card border-border">
                                    <SelectItem value="Segunda a Sexta">Segunda a Sexta</SelectItem>
                                    <SelectItem value="Segunda a Sábado">Segunda a Sábado</SelectItem>
                                    <SelectItem value="Todos os dias">Todos os dias</SelectItem>
                                    <SelectItem value="Segunda">Segunda</SelectItem>
                                    <SelectItem value="Terça">Terça</SelectItem>
                                    <SelectItem value="Quarta">Quarta</SelectItem>
                                    <SelectItem value="Quinta">Quinta</SelectItem>
                                    <SelectItem value="Sexta">Sexta</SelectItem>
                                    <SelectItem value="Sábado">Sábado</SelectItem>
                                    <SelectItem value="Domingo">Domingo</SelectItem>
                                    <SelectItem value="Fim de semana">Fim de semana</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Horário Início</Label>
                                  <Input
                                    type="time"
                                    value={schedule.startTime}
                                    onChange={(e) => updateSchedule(schedule.id, 'startTime', e.target.value)}
                                    disabled={!isEditing}
                                    className="bg-input-background h-9 text-sm border-border"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label className="text-xs text-muted-foreground">Horário Fim</Label>
                                  <Input
                                    type="time"
                                    value={schedule.endTime}
                                    onChange={(e) => updateSchedule(schedule.id, 'endTime', e.target.value)}
                                    disabled={!isEditing}
                                    className="bg-input-background h-9 text-sm border-border"
                                  />
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground">
                              Você ficará online automaticamente {schedule.day.toLowerCase()} das {schedule.startTime} às {schedule.endTime}
                            </p>
                          </CardContent>
                        </Card>
                      ))}

                      {isEditing && schedules.length < 5 && (
                        <Button
                          type="button"
                          onClick={addSchedule}
                          variant="outline"
                          className="w-full h-9 text-sm border-dashed border-green-500/50 hover:bg-green-500/10 text-green-500"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Horário
                        </Button>
                      )}

                      <p className="text-xs text-muted-foreground bg-blue-500/10 border border-blue-500/20 rounded-md p-2">
                        💡 <strong>Dica:</strong> Configure múltiplos horários para diferentes dias da semana. Por exemplo: manhã e tarde em dias úteis.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}


            {/* Senha - sempre disponível para edição */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm">Senha Atual</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder={isEditing ? "Digite sua senha atual" : "••••••••"}
                disabled={!isEditing}
                className="bg-input-background h-10 text-sm border-border"
              />
            </div>
            {isEditing && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Digite sua nova senha"
                    className="bg-input-background h-10 text-sm border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua nova senha"
                    className="bg-input-background h-10 text-sm border-border"
                  />
                </div>
              </>
            )}
            
            {isEditing && (
              <div className="flex gap-2 pt-2">
                <Button type="submit" className={`${getColor()} flex-1 sm:flex-initial h-10 text-sm`}>
                  Salvar Alterações
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 sm:flex-initial h-10 text-sm border-border"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Reviews Section (for drivers and passengers) */}
      {userType !== 'advertiser' && userType !== 'admin' && (
        <Card className="shadow-sm bg-card border-border">
          <CardHeader className="p-4">
            <CardTitle className="text-foreground text-base lg:text-lg">Avaliações Recentes</CardTitle>
            <CardDescription className="text-xs lg:text-sm">O que outros usuários dizem sobre você</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3 lg:space-y-4">
              {[1, 2, 3].map((review) => (
                <div key={review} className="flex gap-3 lg:gap-4 pb-3 lg:pb-4 border-b border-border last:border-0">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={getColor()}>
                      {review === 1 ? 'M' : review === 2 ? 'A' : 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <span className="text-foreground text-sm lg:text-base truncate">
                        {review === 1 ? 'Maria Santos' : review === 2 ? 'Ana Costa' : 'Pedro Lima'}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 lg:w-4 lg:h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs lg:text-sm">
                      {review === 1
                        ? 'Excelente motorista, muito pontual e carro sempre limpo!'
                        : review === 2
                        ? 'Muito educado e dirigiu com bastante cuidado. Recomendo!'
                        : 'Ótima experiência, já marquei para a próxima semana.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
      
      <Footer />
      <ScrollToTop />
    </div>
  );
}