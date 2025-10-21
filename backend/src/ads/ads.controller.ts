import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdsDto } from './dto/create-ads.dto';
import { UpdateAdsDto } from './dto/update-ads.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/roles.decorator';

@ApiTags('Anúncios')
@ApiBearerAuth()
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @ApiOperation({ summary: 'Retorna anúncios ativos aleatórios para telas em geral' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 5 })
  @Get('random')
  @Public()
  async getRandomAds(@Query('limit') limit?: number) {
    return this.adsService.getRandomActiveAds(limit ? Number(limit) : 5);
  }

  
  @ApiOperation({ summary: 'Cria um novo anúncio' })  
  @Post()
  async create(@Body() dto: CreateAdsDto, @Req() req) {
    return this.adsService.create(dto, req.user.sub);
  }
  
  @ApiOperation({ summary: 'Retorna todos os anúncios do usuário autenticado' })  
  @Get('my')
  async getUserAds(@Req() req) {
    return this.adsService.getUserAds(req.user.sub);
  }
  
  @ApiOperation({ summary: 'Retorna KPIs e métricas do usuário autenticado para o dashboard' })  
  @Get('my/kpis')
  async getUserKpis(@Req() req) {
    return this.adsService.getUserKpis(req.user.sub);
  }
  
  @ApiOperation({ summary: 'Atualiza dados de um anúncio (editar, ativar, pausar)' })
  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  async updateAd(@Param('id') id: string, @Body() dto: UpdateAdsDto, @Req() req) {
    return this.adsService.updateAd(id, dto, req.user.sub);
  }
}
