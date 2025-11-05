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
  Delete,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdsDto } from './dto/create-ads.dto';
import { UpdateAdsDto } from './dto/update-ads.dto';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { UpdateAdStatusDto } from './dto/update-status.dto';

@ApiTags('ads')
@ApiBearerAuth()
@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) { }

  @ApiOperation({ summary: 'Retorna anúncios ativos aleatórios para telas em geral' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 5 })
  @Get('random')
  @Public()
  async getRandomAds(@Query('limit') limit?: number) {
    return this.adsService.getRandomActiveAds(limit ? Number(limit) : 5);
  }

  @Get()
  async getAllAds() {
    return this.adsService.getAllAds();
  }

  @Get('count')
  @ApiOperation({ summary: 'Retorna a contagem total de anúncios' })
  async getAdsCount() {
    return this.adsService.getAdsCount();
  }


  @ApiOperation({ summary: 'Cria um novo anúncio' })
  @Post(':userId/anuncios')
  @UseInterceptors(FileInterceptor('image'))
  async create(@Param('userId') userId: string, @Body() dto: CreateAdsDto, @UploadedFile() file: Express.Multer.File) {
    return this.adsService.create(dto, userId, file);
  }

  @ApiOperation({ summary: 'Retorna todos os anúncios do usuário autenticado' })
  @Get('my/:id')
  async getUserAds(@Param('id') id: string) {
    return this.adsService.getUserAds(id);
  }

  @ApiOperation({ summary: 'Retorna KPIs e métricas do usuário autenticado para o dashboard' })
  @Get(':userId/my/kpis')
  async getUserKpis(@Param('userId') userId: string) {
    return this.adsService.getUserKpis(userId);
  }

  @ApiOperation({ summary: 'Atualiza dados de um anúncio' })
  @ApiParam({ name: 'id', type: String })
  @UseInterceptors(FileInterceptor('image'))
  @Patch(':id')
  async updateAd(@Param('id') id: string, @Body() dto: UpdateAdsDto, @UploadedFile() file?: Express.Multer.File) {
    return this.adsService.updateAd(id, dto, file);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {

    return this.adsService.deleteById(id);
  }

  @Public()
  @ApiOperation({ summary: 'Adiciona uma visualização ao anuncio' })
  @Patch(':id/clicks')
  async updateViews(@Param('id') id: string) {
    return this.adsService.updateViews(id);

  }

  @ApiOperation({ summary: 'Altera status do anuncio' })
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: UpdateAdStatusDto) {
    return this.adsService.updateStatus(id, body.isActive);
  }

  @Get('stats/monthly-growth')
  @ApiOperation({ summary: 'Retorna o crescimento mensal de anúncios ativos' })
  async getMonthlyGrowth() {
    return this.adsService.getMonthlyGrowth();
  }

  @Get('stats/chart-data')
  @ApiOperation({ summary: 'Retorna dados do gráfico dos últimos 4 meses' })
  async getChartData() {
    return this.adsService.getChartData();
  }

}
