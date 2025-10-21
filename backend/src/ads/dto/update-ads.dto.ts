import { PartialType } from '@nestjs/mapped-types';
import { CreateAdsDto } from './create-ads.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateAdsDto extends PartialType(CreateAdsDto) {
  @ApiPropertyOptional({ example: false, description: 'Define se o anúncio está ativo ou pausado' })
  @IsOptional()
  @IsBoolean({ message: 'O isActive deve ser booleano' })
  isActive?: boolean;
}
