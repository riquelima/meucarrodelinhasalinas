import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
constructor(private usersService: UsersService, private jwtService: JwtService) {}


async validateUser(email: string, pass: string) {
const user = await this.usersService.findByEmail(email);
if (!user) return null;
const matches = await bcrypt.compare(pass, user.password);
if (matches) {
const { password, ...result } = user;
return result;
}
return null;
}


async login(user: any) {
const payload = { sub: user._id, email: user.email, role: user.role };
return { access_token: this.jwtService.sign(payload) };
}


async register(createUserDto: any) {
return this.usersService.create(createUserDto);
}
}