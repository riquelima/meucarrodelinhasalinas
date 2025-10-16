import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type RouteDocument = Route & Document;


@Schema({ timestamps: true })
export class Route {
@Prop({ type: Types.ObjectId, required: true, ref: 'User' })
driverId: Types.ObjectId;


@Prop({ required: true })
origin: string;


@Prop({ required: true })
destination: string;


@Prop()
departureTime: string;


@Prop([String])
daysOfWeek: string[];


@Prop()
price: number;


@Prop({ default: 0 })
seatsAvailable: number;
}


export const RouteSchema = SchemaFactory.createForClass(Route);