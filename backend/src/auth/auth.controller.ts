import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
constructor(private authService: AuthService) {}


@Post('login')
async login(@Body() body: any) {
const { email, password } = body;
const user = await this.authService.validateUser(email, password);
if (!user) throw new Error('Invalid credentials');
return this.authService.login(user);
}


@Post('register')
async register(@Body() body: any) {
return this.authService.register(body);
}
}