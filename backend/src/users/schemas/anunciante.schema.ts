import { SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Prop } from '@nestjs/mongoose';

export class Anunciante extends User {
  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  CNPJ: string;
}

export const AnuncianteSchema = SchemaFactory.createForClass(Anunciante);
