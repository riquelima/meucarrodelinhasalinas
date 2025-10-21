import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Max, Min } from 'class-validator';
import { Document, Types } from 'mongoose';


export type ReviewDocument = Review & Document;


@Schema({ timestamps: true })
export class Review {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    reviewerId: Types.ObjectId;


    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    receiverId: Types.ObjectId;


    @Prop({ required: true })
    rating: number;


    @Prop({ required: true })
    content: string;
}


export const ReviewSchema = SchemaFactory.createForClass(Review);