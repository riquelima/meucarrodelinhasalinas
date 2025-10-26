import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('blog')
@ApiBearerAuth()
@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Post()
    @ApiOperation({ summary: 'Cria um novo blog' })
    @UseInterceptors(FileInterceptor('image'))
    @UseInterceptors(FileInterceptor('image2'))
    @UseInterceptors(FileInterceptor('image3'))
    async create(
        @UploadedFile() file: Express.Multer.File, @UploadedFile('image2') file2: Express.Multer.File, @UploadedFile('image3') file3: Express.Multer.File, @Body() createBlogDto: CreateBlogDto,) {
        return this.blogService.create(createBlogDto, file, file2, file3);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todos os blogs' })
    async findAll() {
        return this.blogService.findAll();
    }

    @Get('/home')
    @ApiOperation({ summary: 'Retorna os blogs para página inicial' })
    async findHomeBlogs() {
        return this.blogService.findHomeBlogs();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retorna um blog pelo ID' })
    async findOne(@Param('id') id: string) {
        return this.blogService.findOne(id);
    }

    @Get('count/all')
    @ApiOperation({ summary: 'Retorna a contagem total de blogs, pra tela de admin' })
    async countAll() {
        const count = await this.blogService.countAll();
        return { total: count };
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image'))
    async update(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        return this.blogService.update(id, updateBlogDto, file);
    }
}
