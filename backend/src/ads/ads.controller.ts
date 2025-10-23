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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdsDto } from './dto/create-ads.dto';
import { UpdateAdsDto } from './dto/update-ads.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';

@ApiTags('ads')
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
  @Post(':userId/anuncios')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Param('userId') userId: string, @Body() dto: CreateAdsDto, @UploadedFile() file: Express.Multer.File) {
    return this.adsService.create(dto, userId, file);
  }
  
  @ApiOperation({ summary: 'Retorna todos os anúncios do usuário autenticado' })  
  @Get(':id/my')
  async getUserAds(@Req() req) {
    return this.adsService.getUserAds(req.user.sub);
  }

  @ApiOperation({ summary: 'Retorna KPIs e métricas do usuário autenticado para o dashboard' })
  @Get(':userId/my/kpis')
  async getUserKpis(@Param('userId') userId: string) {
    return this.adsService.getUserKpis(userId);
  }
  
  @ApiOperation({ summary: 'Atualiza dados de um anúncio (editar, ativar, pausar)' })
  @ApiParam({ name: 'id', type: String })
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  async updateAd(@Param('id') id: string, @Body() dto: UpdateAdsDto, @UploadedFile() file?: Express.Multer.File) {
    return this.adsService.updateAd(id, dto, file);
  }
}
