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


    @Get(':id')
    async getProfile(@Param('id') id: string) {
        const user = await this.usersService.findById(id);

        // Toda vez que um perfil de motorista for acessado, add 1 click nele
        if (user?.role.includes('motorista')) {
            await this.usersService.incrementProfileView(id);
        }

        return user;
    }

    @Get('motoristas')
    async getAllMotoristas() {
        return this.usersService.findAllMotoristas();
    }

    @Get('motoristas/profile-views/top')
    async getTopMotoristasByProfileViews() {
        return this.usersService.getTopMotoristasByProfileViews();
    }

    @Put()
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
}