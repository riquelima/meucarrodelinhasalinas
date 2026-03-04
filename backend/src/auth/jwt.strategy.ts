import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';


import { APP_CONFIG } from '../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: APP_CONFIG.JWT_SECRET || 'secretKey',
        });
    }


    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
}