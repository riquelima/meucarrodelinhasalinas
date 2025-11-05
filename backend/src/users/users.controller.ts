import { Controller, Delete, Get, Param, Patch, Put, Body, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { get } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';




@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('motoristas')
    @ApiOperation({ summary: 'Retorna todos os motoristas' })
    async getAllMotoristas() {
        return this.usersService.findAllMotoristas();
    }

    @Get()
    @ApiOperation({ summary: 'Retorna todos os usuários' })
    async getAllUsers() {
        return this.usersService.findAllUsers();
    }

    @Get('count')
    @ApiOperation({ summary: 'Retorna a contagem total de usuários' })
    async getUserCount() {
        return this.usersService.getUserCount();
    }

    @Get('motoristas/profile-views/top')
    @ApiOperation({ summary: 'Retorna os motoristas com mais visualizações de perfil' })
    async getTopMotoristasByProfileViews() {
        return this.usersService.getTopMotoristasByProfileViews();
    }  
    
    @Delete()
    @ApiOperation({ summary: 'Deletar todos os usuários, só pra teste tmj' })
    deletarTodosUsuarios() {
        return this.usersService.deleteAll();
    }

    @Patch('/status/:id')
    @ApiOperation({ summary: 'Muda status do motorista' })
    mudarStatusMotorista(@Param('id') id: string, @Body() updateUserStatusDto: UpdateUserStatusDto) {
        return this.usersService.mudarStatusMotorista(id, updateUserStatusDto.status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retorna o perfil de um usuário pelo ID, e se for motorista adiciona 1 visualização' })
    async getProfile(@Param('id') id: string) {
        const user = await this.usersService.findByIdComplete(id);
        return user;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza os dados do usuário' })
    @UseInterceptors(FileInterceptor('avatar'))
    updateMe(@Body() dto: UpdateUserDto, @Param('id') id: string, @UploadedFile() file?: Express.Multer.File,) {
        return this.usersService.updateCurrentUser(dto, id, file);
    }

    @Delete(':id')
    async deleteById(@Param('id') id: string, @Req() req: any){
        const currentUserId = req.user?.userId || req.user?.sub;
        return this.usersService.deleteById(id, currentUserId) 
    }

    @Get('stats/monthly-growth')
    @ApiOperation({ summary: 'Retorna o crescimento mensal de usuários' })
    async getMonthlyGrowth() {
        return this.usersService.getMonthlyGrowth();
    }

    @Get('stats/chart-data')
    @ApiOperation({ summary: 'Retorna dados do gráfico dos últimos 4 meses' })
    async getChartData() {
        return this.usersService.getChartData();
    }
}