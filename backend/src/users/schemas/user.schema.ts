import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type UserDocument = User & Document;


@Schema({ timestamps: true })
export class User {
@Prop({ required: true })
name: string;


@Prop({ required: true, unique: true })
email: string;


@Prop({ required: true })
password: string; // hash


@Prop({ default: 'passageiro' })
role: 'passageiro' | 'motorista' | 'anunciante' | 'admin';


// so pra motoristas
@Prop({ default: 0 })
profileViews: number;


@Prop({ default: 0 })
totalReviews: number;


@Prop({ default: 0 })
avgRating: number;
}


export const UserSchema = SchemaFactory.createForClass(User);