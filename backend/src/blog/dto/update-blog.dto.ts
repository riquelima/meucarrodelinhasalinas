import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
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
  link?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return value;
  })
  @IsBoolean()
  isPublished?: boolean;


}
