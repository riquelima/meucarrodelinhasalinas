import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BlogCategory } from '../schemas/blog.schema';

export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ApiProperty({ enum: BlogCategory })
  @IsEnum(BlogCategory)
  category: BlogCategory;

  @ApiProperty({ required: false, description: 'Imagem do blog principal (arquivo)' })
  @IsOptional()
  image?: string;

  @ApiProperty({ required: false, description: 'Imagem do blog 2 (arquivo)' })
  @IsOptional()
  image2?: string;

  @ApiProperty({ required: false, description: 'Imagem do blog 3 (arquivo)' })
  @IsOptional()
  image3?: string;

  @ApiProperty({ required: false, description: 'Indica se o blog está publicado' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
