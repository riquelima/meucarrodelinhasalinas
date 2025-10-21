import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

@Schema()
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

  @Prop({ required: true })
  carColor: string;

  @Prop({ required: true })
  seatsAvailable: number;

  @Prop({ required: true })
  availableDays: string;

  @Prop({ default: 'offline' })
  status: string;
}

export type MotoristaDocument = Motorista & Document;
export const MotoristaSchema = SchemaFactory.createForClass(Motorista);
