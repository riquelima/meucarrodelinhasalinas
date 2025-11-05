import { IsString, IsEnum, IsBoolean, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdsCategory } from '../schemas/ads.schema';

export class CreateAdsDto {


  @ApiProperty({ example: 'Supermercado São João', description: 'Nome da empresa anunciante' })
  @IsString({ message: 'O nome da empresa deve ser uma string' })
  @IsNotEmpty({ message: 'O nome da empresa é obrigatório' })
  nameCompany: string;

  @ApiProperty({ example: '11988887777', description: 'Telefone do anunciante' })
  @IsString({ message: 'O telefone deve ser uma string' })
  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  numberPhone: string;

  @ApiPropertyOptional({ example: 'Promoção de final de semana', description: 'Descrição do anúncio' })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiProperty({ example: 'https://exemplo.com/imagem.jpg', description: 'URL da imagem do anúncio' })  
  @IsOptional()  
  image: string;

  @ApiProperty({ enum: AdsCategory, example: AdsCategory.ALIMENTACAO, description: 'Categoria do anúncio' })
  @IsEnum(AdsCategory, { message: 'Categoria inválida' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  category: AdsCategory;

  @ApiPropertyOptional({ example: true, description: 'Define se o anúncio está ativo' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean({ message: 'O isActive deve ser booleano' })
  isActive?: boolean;

}
