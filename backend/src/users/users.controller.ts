import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { get } from 'mongoose';


@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }


    @Get(':id')
    async getProfile(@Param('id') id: string) {
        const user = await this.usersService.findById(id);

        // Toda vez que um perfil de motorista for acessado, add 1 click nele
        if (user?.roles.includes('motorista')) {
            await this.usersService.incrementProfileView(id);
        }

        return user;
    }

    @Get()
    async getAllUsers() {
        return this.usersService.findAll();
    }
} 