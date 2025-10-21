import { SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Prop, Schema } from '@nestjs/mongoose';

export class MotoristaDocument extends User {
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

    @Prop({ required: true })
    carColor: string;

    @Prop({ required: true })
    seatsAvailable: number;

    @Prop({ required: true })
    availableDays: string;

    @Prop({ required: true , default: 'offline'})
    status: string;

}

export const MotoristaSchema = SchemaFactory.createForClass(MotoristaDocument);
