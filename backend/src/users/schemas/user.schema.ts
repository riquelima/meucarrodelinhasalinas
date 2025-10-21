import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

export enum UserRole {
    PASSAGEIRO = 'passageiro',
    MOTORISTA = 'motorista',
    ANUNCIANTE = 'anunciante',
    ADMIN = 'admin',
}

@Schema({ timestamps: true, discriminatorKey: 'role' }) // <-- role será o discriminator
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    // @Prop({ type: [String], enum: ['passageiro', 'motorista', 'anunciante', 'admin'], default: ['passageiro'] })
    // role: ('passageiro' | 'motorista' | 'anunciante' | 'admin')[];

    @IsEnum(UserRole) 
    @ApiProperty({ enum: UserRole }) 
    role: UserRole;

    @Prop({ default: 0 })
    totalReviews: number;

    @Prop({ default: 0 })
    avgRating: number;

    @Prop({ default: 0 })
    profileViews: number;

    @Prop()
    avatar?: string;

    @Prop({ required: true })
    number: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
