import { PartialType } from '@nestjs/mapped-types';
import { CreateAdsDto } from './create-ads.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { AdsCategory } from '../schemas/ads.schema';

export class UpdateAdsDto {

    @IsOptional()
    nameCompany: string;
  
    @IsOptional()
    numberPhone: string;
  
    @IsOptional()
    description?: string;  
    
    @IsOptional()  
    image: string;
  
    @IsOptional()
    category: AdsCategory;
  
    @IsOptional()
    @Transform(({ value }) => {
      if (value === 'true' || value === true) return true;
      if (value === 'false' || value === false) return false;
      return value;
    })
    @IsBoolean({ message: 'O isActive deve ser booleano' })
    isActive?: boolean;
}
