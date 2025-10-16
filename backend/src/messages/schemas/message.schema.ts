import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  receiverId: string;

  @Prop()
  text?: string;

  @Prop()
  image?: string; 
}

export const MessageSchema = SchemaFactory.createForClass(Message);
