import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export enum UserRole {
  PASSAGEIRO = 'passageiro',
  MOTORISTA = 'motorista',
  ANUNCIANTE = 'anunciante',
}

export class CreateUserDto {
  @ApiProperty({ example: 'Gabriel Ramos', description: 'Nome completo do usuário' })
  @IsString({ message: 'O nome deve ser uma string válida' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({ example: 'gabriel@email.com', description: 'Email do usuário' })
  @IsEmail({}, { message: 'O e-mail informado é inválido' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  @IsString({ message: 'A senha deve ser uma string válida' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.PASSAGEIRO,
    description: 'Tipo de usuário',
  })
  @IsEnum(UserRole, { message: 'O tipo de usuário deve ser passageiro, motorista ou anunciante' })
  role: UserRole;

  @ApiProperty({
    example: '+55719999999',
    description: 'Número de telefone do usuário',
  })
  @IsString({ message: 'O número deve ser uma string' })
  @IsNotEmpty({ message: 'O número é obrigatório' })
  number: string;

  // MOTORISTA
  @ValidateIf(o => o.role === UserRole.MOTORISTA)
  @IsNotEmpty({ message: 'O veículo é obrigatório para motoristas' })
  @IsString({ message: 'O veículo deve ser uma string' })
  vehicle?: string;

  @ValidateIf(o => o.role === UserRole.MOTORISTA)
  @IsNotEmpty({ message: 'A placa do veículo é obrigatória para motoristas' })
  @IsString({ message: 'A placa do veículo deve ser uma string' })
  licensePlate?: string;

  @ValidateIf(o => o.role === UserRole.MOTORISTA)
  @IsNotEmpty({ message: 'A origem da rota é obrigatória para motoristas' })
  @IsString({ message: 'A origem deve ser uma string' })
  origin?: string;

  @ValidateIf(o => o.role === UserRole.MOTORISTA)
  @IsNotEmpty({ message: 'O destino da rota é obrigatório para motoristas' })
  @IsString({ message: 'O destino deve ser uma string' })
  destination?: string;

  //@ValidateIf(o => o.role === UserRole.MOTORISTA)
  @IsOptional()
  //@IsString({ message: 'A descrição deve ser uma string' })
  description?: string; // opcional para motoristas

  @ValidateIf(o => o.role === UserRole.MOTORISTA)
  @IsNotEmpty({ message: 'A cor do carro é obrigatória para motoristas' })
  @IsString({ message: 'A cor do carro deve ser uma string' })
  carColor?: string;

  @ValidateIf(o => o.role === UserRole.MOTORISTA)
  @IsNotEmpty({ message: 'O número de assentos disponíveis é obrigatório para motoristas' })
  seatsAvailable?: number;

  @ValidateIf(o => o.role === UserRole.MOTORISTA)
  @IsNotEmpty({ message: 'Os horários disponíveis são obrigatórios para motoristas' })
  @IsString({ message: 'Os horários disponíveis devem ser uma string' })
  availableDays?: string;

  // ANUNCIANTE 
  @IsOptional()
  //@IsString({ message: 'O nome da empresa deve ser uma string' })
  companyName?: string;

  @IsOptional()
  //@IsString({ message: 'O CNPJ deve ser uma string' })
  cnpj?: string;
}
