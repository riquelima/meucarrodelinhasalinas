import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BlogCategory } from '../schemas/blog.schema';

export class UpdateBlogDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  authorId?: string;

  @ApiProperty({ enum: BlogCategory, required: false })
  @IsEnum(BlogCategory)
  @IsOptional()
  category?: BlogCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  image?: string;
}
