import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum AdsCategory {
    ALIMENTACAO = 'Alimentação',
    SAUDE_BEM_ESTAR = 'Saúde & Bem-Estar',
    EDUCACAO = 'Educação',
    COMPRAS = 'Compras',
    SERVICOS = 'Serviços',
    ENTRETENIMENTO = 'Entretenimento',
    OUTROS = 'Outros',
}

export type AdsDocument = Ads & Document;

@Schema({ timestamps: true })
export class Ads {


    @Prop({ required: true })
    nameCompany: string;


    @Prop({ required: true })
    numberPhone: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    urlImage: string;

    @Prop({ required: true, enum: AdsCategory })
    category: AdsCategory;

    @Prop({ default: 0 })
    views: number;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId; // anunciante 

}


export const AdsSchema = SchemaFactory.createForClass(Ads);