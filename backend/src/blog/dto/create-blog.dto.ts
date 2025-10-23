import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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

  @ApiProperty({ required: false, description: 'Imagem do blog (arquivo)' })
  @IsOptional()
  image?: string;
}
