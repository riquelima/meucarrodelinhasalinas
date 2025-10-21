import { SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Prop } from '@nestjs/mongoose';

export class AnuncianteDocument extends User {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  cnpj: string;
}

export const AnuncianteSchema = SchemaFactory.createForClass(AnuncianteDocument);
