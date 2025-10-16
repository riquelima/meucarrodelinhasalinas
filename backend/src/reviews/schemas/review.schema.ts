import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type ReviewDocument = Review & Document;


@Schema({ timestamps: true })
export class Review {
@Prop({ type: Types.ObjectId, ref: 'User', required: true })
reviewerId: Types.ObjectId;


@Prop({ type: Types.ObjectId, ref: 'User', required: true })
driverId: Types.ObjectId;


@Prop({ required: true })
rating: number;


@Prop()
comment: string;
}


export const ReviewSchema = SchemaFactory.createForClass(Review);