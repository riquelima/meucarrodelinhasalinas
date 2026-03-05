import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { EmailModule } from 'src/email/email.module';
import { APP_CONFIG } from '../config';


@Module({
  imports: [
    UsersModule,
    PassportModule,
    EmailModule,
    JwtModule.register({
      secret: APP_CONFIG.JWT_SECRET,
      signOptions: { expiresIn: APP_CONFIG.JWT_EXPIRES_IN || '1h' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [JwtModule, AuthService],
})
export class AuthModule { }
