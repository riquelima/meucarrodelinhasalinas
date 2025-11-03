import { PartialType } from '@nestjs/mapped-types';
import { CreateAdsDto } from './create-ads.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';
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
    isActive?: boolean;
}
