import { SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Prop, Schema } from '@nestjs/mongoose';

export class Motorista extends User {
    @Prop({ required: true })
    vehicle: string;

    @Prop({ required: true })
    licensePlate: string;

    @Prop({ required: true })
    origin: string;

    @Prop({ required: true })
    destination: string;

    @Prop({ required: true })
    description: string;
}

export const MotoristaSchema = SchemaFactory.createForClass(Motorista);
