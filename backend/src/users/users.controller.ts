import { Controller, Delete, Get, Param, Patch, Put, Body, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { get } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';



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

    @Patch(':id')
    @ApiOperation({ summary: 'Muda status do motorista' })
    mudarStatusMotorista(@Param('id') id: string, @Body() status: string) {
        return this.usersService.mudarStatusMotorista(id, status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Retorna o perfil de um usuário pelo ID, e se for motorista adiciona 1 visualização' })
    async getProfile(@Param('id') id: string) {
        const user = await this.usersService.findByIdComplete(id);
        return user;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Atualiza os dados do usuário' })
    updateMe(@Body() dto: UpdateUserDto, @Param('id') id: string) {
        return this.usersService.updateCurrentUser(dto, id);
    }
}