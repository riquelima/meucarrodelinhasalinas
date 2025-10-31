import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BlogCategory } from '../schemas/blog.schema';

export class CreateBlogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Titulo Obrigatorio' })
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Descricao é obrigatoria' })
  content: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Autor é obrigatorio' })
  authorId: string;

  @ApiProperty({ enum: BlogCategory })
  @IsEnum(BlogCategory)
  category: BlogCategory;
  
  @ApiProperty({ required: false, description: 'Indica se o blog está publicado' })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ required: false, description: 'Link externo' })
  @IsOptional()
  link?: string;
}
