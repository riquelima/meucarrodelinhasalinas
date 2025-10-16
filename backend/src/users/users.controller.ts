import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
constructor(private usersService: UsersService) {}


@Get(':id')
async getProfile(@Param('id') id: string) {
const user = await this.usersService.findById(id);
// Toda vez que um perfil de motorista for acessado, add 1 click nele
if (user && user.role === 'motorista') {
await this.usersService.incrementProfileView(id);
}
return user;
}
}