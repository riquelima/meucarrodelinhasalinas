import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';


@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService, private emailService: EmailService) { }


    async validateUser(email: string, pass: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Senha ou email inválidos');

        const matches = await bcrypt.compare(pass, user.password);

        if (matches) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Senha ou email inválidos');
    }


    async login(user: any) {
        const cutoffDate = new Date('2025-11-01T00:00:00.000Z');
        let userCreatedAt: Date;
        
        try {
            const createdAtValue: any = (user as any).createdAt;
            if (createdAtValue) {
                if (createdAtValue instanceof Date) {
                    userCreatedAt = createdAtValue;
                } else if (typeof createdAtValue === 'string') {
                    userCreatedAt = new Date(createdAtValue);
                } else if (createdAtValue.$date) {
                    userCreatedAt = new Date(createdAtValue.$date);
                } else if (typeof createdAtValue === 'object' && createdAtValue.toString) {
                    userCreatedAt = new Date(createdAtValue.toString());
                } else if (typeof createdAtValue === 'number') {
                    userCreatedAt = new Date(createdAtValue);
                } else {
                    userCreatedAt = new Date(createdAtValue);
                }
                
                if (isNaN(userCreatedAt.getTime())) {
                    userCreatedAt = new Date();
                }
            } else {
                userCreatedAt = new Date();
            }
        } catch (error) {
            userCreatedAt = new Date();
        }
        
        const isLegacyUser = userCreatedAt.getTime() < cutoffDate.getTime();
        const payload = { sub: user._id, email: user.email, role: user.role };
        return { access_token: this.jwtService.sign(payload), isLegacyUser };
    }


    async register(createUserDto: any) {
        return this.usersService.create(createUserDto);
    }


    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new BadRequestException('Usuário não encontrado.');

        // Gera JWT por 15min
        const token = this.jwtService.sign(
            { id: user._id },
            { expiresIn: '15m' },
        );

        await this.emailService.sendResetPasswordEmail(user.email, user.name, token);

        return { message: 'Email de recuperação enviado com sucesso! Verifique sua caixa de entrada ou spam.' };
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.usersService.findById(payload.id);
            if (!user) throw new BadRequestException('Usuário não encontrado.');

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.usersService.updatePassword(user._id.toString(), hashedPassword);

            return { message: 'Senha redefinida com sucesso!' };
        } catch (error) {
            throw new BadRequestException('Token inválido ou expirado.');
        }
    }
}