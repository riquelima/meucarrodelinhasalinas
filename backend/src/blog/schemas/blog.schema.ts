import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum BlogCategory {
    TECNOLOGIA = 'tecnologia',
    FINANCAS = 'financas',
    SEGURANCA = 'seguranca',
    DICAS = 'dicas',
    SUSTENTABILIDADE = 'sustentabilidade',
}

@Schema({ timestamps: true }) // cria automaticamente createdAt e updatedAt
export class Blog extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    authorId: string;

    @Prop({required: true, default: 0})
    views: number;

    @Prop({ required: true, enum: BlogCategory })
    category: BlogCategory;

    @Prop({ required: true })
    image: string;

    @Prop({ default: ''})
    image2: string;

    @Prop({ default: '' })
    image3: string;

    @Prop({ default: true })
    isPublished: boolean;

    @Prop({ default: true })
    link: string;

}

export const BlogSchema = SchemaFactory.createForClass(Blog);
