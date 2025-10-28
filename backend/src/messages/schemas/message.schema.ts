import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  from: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  to: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
