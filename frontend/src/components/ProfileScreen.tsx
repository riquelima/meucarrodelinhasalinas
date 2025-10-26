import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Star, Car, TrendingUp, Award, Edit2, Camera, LogOut, Radio, Loader2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  password?: string;
  totalReviews?: number;
  avgRating?: number;
  profileViews?: number;
  avatar?: string;
  number: string;
  role: 'passageiro' | 'motorista' | 'anunciante' | 'admin';
  createdAt?: { $date: string } | string;
  updatedAt?: { $date: string } | string;
  vehicle?: string;
  licensePlate?: string;
  origin?: string;
  destination?: string;
  description?: string;
  carColor?: string;
  seatsAvailable?: number;
  availableDays?: string;
  cnpj?: string;
  companyName?: string;
  status?: string;
}

interface ProfileScreenProps {
  onLogout?: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

type UIType = 'passenger' | 'driver' | 'advertiser' | 'admin';

const initialProfileState: UserProfile = {
  _id: '',
  name: '',
  email: '',
  role: 'passageiro',
  number: '',
  totalReviews: 0,
  avgRating: 0,
  profileViews: 0,
};

const getUserTypeFromRole = (role: string): UIType => {
  if (role === 'admin') return 'admin';
  if (role === 'motorista') return 'driver';
  if (role === 'anunciante') return 'advertiser';
  return 'passenger';
};

interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const fetchUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  let userId: string;
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    userId = decodedToken.sub;
  } catch (error) {
    throw new Error("Token inválido ou expirado.");
  }

  const response = await fetch(`http://localhost:3000/users/${userId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Falha ao buscar dados do perfil.");
  }

  const data = await response.json();
  return data;
};

const updateUserProfile = async (userId: string, formData: FormData): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token de autenticação não encontrado.");
  }

  const response = await fetch(`http://localhost:3000/users/${userId}`, {
    method: 'PATCH',
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Falha ao atualizar dados do perfil.";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      errorMessage = `Erro ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
};

export function ProfileScreen({ onLogout, theme, onThemeChange }: ProfileScreenProps) {
  const [profile, setProfile] = useState<UserProfile>(initialProfileState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const userType = getUserTypeFromRole(profile.role);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setProfile(data);
        setPreviewUrl(data.avatar || null);
      } catch (err: any) {
        console.error('Erro ao buscar perfil:', err);
        setError('Não foi possível carregar os dados do perfil.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);


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

  const formatFullDate = (isoDate: string | { $date: string } | undefined) => {
    if (!isoDate) return "";
    const date = typeof isoDate === 'string' ? new Date(isoDate) : new Date(isoDate.$date);
    if (isNaN(date.getTime())) return "";
    const formatted = date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validação do arquivo
      const maxSize = 2 * 1024 * 1024; // 2MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      
      if (file.size > maxSize) {
        setError('A imagem deve ter no máximo 2MB.');
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        setError('Formato de arquivo não suportado. Use JPG, PNG ou WEBP.');
        return;
      }
      
      setError(null);
      
      // Redimensionar imagem
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 800;
        let { width, height } = img;
        
        // Calcular novas dimensões mantendo proporção
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Converter para blob
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            setSelectedFile(resizedFile);
            
            // Preview da imagem redimensionada
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(resizedFile);
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const newPasswordValue = newPassword.trim();
      const confirmPasswordValue = confirmPassword.trim();

      if (newPasswordValue) {
        if (newPasswordValue.length < 6) {
          setError('A nova senha deve ter pelo menos 6 caracteres.');
          setIsSaving(false);
          return;
        }

        if (newPasswordValue !== confirmPasswordValue) {
          setError('As senhas não coincidem.');
          setIsSaving(false);
          return;
        }

        if (!currentPassword.trim()) {
          setError('Digite sua senha atual para alterar a senha.');
          setIsSaving(false);
          return;
        }
      }

      const formData = new FormData();
      
      if (selectedFile) {
        formData.set('avatar', selectedFile);
      }

      const target = e.currentTarget;
      formData.set('name', target.name.value);
      formData.set('email', target.email.value);
      formData.set('number', target.number.value);

      if (userType === 'driver') {
        if (target.vehicle?.value) formData.set('vehicle', target.vehicle.value);
        if (target.licensePlate?.value) formData.set('licensePlate', target.licensePlate.value);
        if (target.origin?.value) formData.set('origin', target.origin.value);
        if (target.destination?.value) formData.set('destination', target.destination.value);
        if (target.carColor?.value) formData.set('carColor', target.carColor.value);
        if (target.seatsAvailable?.value) formData.set('seatsAvailable', target.seatsAvailable.value);
        if (target.availableDays?.value) formData.set('availableDays', target.availableDays.value);
        if (target.description?.value) formData.set('description', target.description.value);
      }

      if (userType === 'advertiser') {
        if (target.companyName?.value) formData.set('companyName', target.companyName.value);
        if (target.cnpj?.value) formData.set('cnpj', target.cnpj.value);
      }
      
      if (newPasswordValue && newPasswordValue.trim() !== '') {
        formData.set('password', newPasswordValue);
      }

      const updatedProfile = await updateUserProfile(profile._id, formData);
      setProfile(updatedProfile);
      setPreviewUrl(updatedProfile.avatar || null);
      setIsEditing(false);
      setSelectedFile(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err);
      const errorMessage = err.message || 'Não foi possível atualizar os dados do perfil.';
      
      setError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-lg">Carregando perfil...</p>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="pt-20 p-4 max-w-4xl mx-auto text-center">
        <h1 className="text-xl text-red-500">Erro ao carregar</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  const stats = userType === 'passenger'
    ? [
      { label: "Avaliação média", value: profile.avgRating?.toFixed(1) || "0.0", icon: Star },
      { label: "Membro desde", value: formatFullDate(profile.createdAt), icon: Award },
    ]
    : userType === 'driver'
      ? [
        { label: "Avaliação média", value: profile.avgRating?.toFixed(1) || "0.0", icon: Star },
        { label: "Membro desde", value: formatFullDate(profile.createdAt), icon: TrendingUp },
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

        <Card className="shadow-sm bg-card border-border">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20 lg:w-24 lg:h-24">
                  {previewUrl && <AvatarImage src={previewUrl} alt={profile.name} />}
                  <AvatarFallback className={`${getColor()} text-white text-2xl lg:text-3xl`}>
                    {profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
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
                      onChange={handleFileChange}
                    />
                  </button>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-foreground mb-1 text-lg lg:text-xl">{profile.name}</h2>
                <p className="text-muted-foreground text-sm mb-2">{profile.email}</p>
                <Badge className={`${getColorBg()} ${getColorText()} text-xs border-0`}>
                  {getUserTypeLabel()}
                </Badge>
              </div>
              <Button
                onClick={() => {
                  if (isEditing) {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setSelectedFile(null);
                    setPreviewUrl(profile.avatar || null);
                    setError(null);
                  }
                  setIsEditing(!isEditing);
                }}
                variant="outline"
                className="w-full sm:w-auto h-9 text-sm border-border"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </Button>
            </div>
          </CardContent>
        </Card>

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

        <Card className="shadow-sm bg-card border-border">
          <CardHeader className="p-4">
            <CardTitle className="text-foreground text-base lg:text-lg">Informações Pessoais</CardTitle>
            <CardDescription className="text-xs lg:text-sm">Suas informações de cadastro</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={profile.name}
                    disabled={!isEditing}
                    required
                    className="bg-input-background h-10 text-sm border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={profile.email}
                    disabled={!isEditing}
                    required
                    className="bg-input-background h-10 text-sm border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="number" className="text-sm">Celular</Label>
                <Input
                  id="number"
                  name="number"
                  type="tel"
                  defaultValue={profile.number}
                  disabled={!isEditing}
                  required
                  className="bg-input-background h-10 text-sm border-border"
                />
              </div>
              {userType === 'driver' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="vehicle" className="text-sm">Veículo</Label>
                    <Input
                      id="vehicle"
                      name="vehicle"
                      defaultValue={profile.vehicle || ''}
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licensePlate" className="text-sm">Placa do Veículo</Label>
                    <Input
                      id="licensePlate"
                      name="licensePlate"
                      defaultValue={profile.licensePlate || ''}
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="origin" className="text-sm">Ponto de Partida Principal</Label>
                      <Input
                        id="origin"
                        name="origin"
                        defaultValue={profile.origin || ''}
                        disabled={!isEditing}
                        className="bg-input-background h-10 text-sm border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination" className="text-sm">Destino Principal</Label>
                      <Input
                        id="destination"
                        name="destination"
                        defaultValue={profile.destination || ''}
                        disabled={!isEditing}
                        className="bg-input-background h-10 text-sm border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carColor" className="text-sm">Cor do Veículo</Label>
                    <Input
                      id="carColor"
                      name="carColor"
                      defaultValue={profile.carColor || ''}
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seatsAvailable" className="text-sm">Vagas Disponíveis</Label>
                      <Input
                        id="seatsAvailable"
                        name="seatsAvailable"
                        type="number"
                        defaultValue={profile.seatsAvailable || ''}
                        disabled={!isEditing}
                        className="bg-input-background h-10 text-sm border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availableDays" className="text-sm">Horário Principal</Label>
                      <Input
                        id="availableDays"
                        name="availableDays"
                        defaultValue={profile.availableDays || ''}
                        disabled={!isEditing}
                        className="bg-input-background h-10 text-sm border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm">Descrição</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={profile.description || ''}
                      disabled={!isEditing}
                      className="bg-input-background min-h-[80px] resize-none text-sm border-border"
                    />
                  </div>
                </>
              )}
              {userType === 'advertiser' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-sm">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      defaultValue={profile.companyName || ''}
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj" className="text-sm">CNPJ</Label>
                    <Input
                      id="cnpj"
                      name="cnpj"
                      defaultValue={profile.cnpj || ''}
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                </>
              )}

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
                </>
              )}

              {isEditing && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm">Senha Atual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Digite sua senha atual"
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Digite sua nova senha"
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirme sua nova senha"
                      disabled={!isEditing}
                      className="bg-input-background h-10 text-sm border-border"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deixe os campos de senha em branco se não desejar alterar a senha.
                  </p>
                </>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {isEditing && (
                <div className="flex gap-2 pt-2">
                  <Button 
                    type="submit" 
                    className={`${getColor()} flex-1 sm:flex-initial h-10 text-sm`}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Alterações'
                    )}
                  </Button>
                  
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                      setPreviewUrl(profile.avatar || null);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setError(null);
                    }}
                    className="flex-1 sm:flex-initial h-10 text-sm border-border"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

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