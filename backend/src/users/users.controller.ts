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

    @Get('motoristas/profile-views/top')
    @ApiOperation({ summary: 'Retorna os motoristas com mais visualizações de perfil' })
    async getTopMotoristasByProfileViews() {
        return this.usersService.getTopMotoristasByProfileViews();
    }    

    @Put()
    @ApiOperation({ summary: 'Atualiza os dados do usuário autenticado' })
    updateMe(@Body() dto: UpdateUserDto, @Req() req: any) {
        return this.usersService.updateCurrentUser(dto, req.user);
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
        const user = await this.usersService.findById(id);

        // Toda vez que um perfil de motorista for acessado, add 1 click nele
        if (user?.role.includes('motorista')) {
            await this.usersService.incrementProfileView(id);
        }

        return user;
    }
}