import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    UploadedFiles,
    UseInterceptors,
    BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/roles.decorator';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('blog')
@ApiBearerAuth()
@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }


    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image', maxCount: 1 },
            { name: 'image2', maxCount: 1 },
            { name: 'image3', maxCount: 1 },
        ]),
    )
    async create(
        @UploadedFiles()
        files: {
            image?: Express.Multer.File[];
            image2?: Express.Multer.File[];
            image3?: Express.Multer.File[];
        },
        @Body() createBlogDto: CreateBlogDto,
    ) {
        const file = files.image?.[0];
        const file2 = files.image2?.[0];
        const file3 = files.image3?.[0];

        if (!file) {
            throw new BadRequestException('A imagem principal é obrigatória');
        }

        return this.blogService.create(createBlogDto, file, file2, file3);
    }


    @Get()
    @ApiOperation({ summary: 'Lista todos os blogs' })
    @Public()
    async findAll() {
        return this.blogService.findAll();
    }

    @Get('/home')
    @ApiOperation({ summary: 'Retorna os blogs para página inicial' })
    @Public()
    async findHomeBlogs() {
        return this.blogService.findHomeBlogs();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retorna um blog pelo ID' })
    @Public()
    async findOne(@Param('id') id: string) {
        return this.blogService.findOne(id);
    }

    @Get('count/all')
    @ApiOperation({ summary: 'Retorna a contagem total de blogs, pra tela de admin' })
    @Public()
    async countAll() {
        return await this.blogService.countAll();
    }

    @Put(':id')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'image', maxCount: 1 },
            { name: 'image2', maxCount: 1 },
            { name: 'image3', maxCount: 1 },
        ]),
    )
    async update(
        @Param('id') id: string,
        @UploadedFiles()
        files: {
            image?: Express.Multer.File[];
            image2?: Express.Multer.File[];
            image3?: Express.Multer.File[];
        },
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        const file = files.image?.[0];
        const file2 = files.image2?.[0];
        const file3 = files.image3?.[0];
        return this.blogService.update(id, updateBlogDto, file, file2, file3);
    }


    @ApiOperation({ summary: 'Adiciona uma visualização ao post' })
    @Patch(':id')
    async updateViews(@Param('id') id: string) {
        return this.blogService.updateViews(id);

    }

    @Delete(':id')
    async deleteById(@Param('id') id: string) {
        return this.blogService.deleteById(id);
    }

    @Get('stats/monthly-growth')
    @ApiOperation({ summary: 'Retorna o crescimento mensal de posts no blog' })
    async getMonthlyGrowth() {
        return this.blogService.getMonthlyGrowth();
    }

    @Get('stats/chart-data')
    @ApiOperation({ summary: 'Retorna dados do gráfico dos últimos 4 meses' })
    async getChartData() {
        return this.blogService.getChartData();
    }

    @Get('stats/total-views')
    @ApiOperation({ summary: 'Retorna o total de visualizações de todos os blogs' })
    async getTotalViews() {
        return this.blogService.getTotalViews();
    }

    @Get('stats/views-monthly-growth')
    @ApiOperation({ summary: 'Retorna o crescimento mensal de visualizações' })
    async getViewsMonthlyGrowth() {
        return this.blogService.getViewsMonthlyGrowth();
    }
}
