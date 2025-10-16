import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route, RouteDocument } from './schemas/route.schema';


@Injectable()
export class RoutesService {
constructor(@InjectModel(Route.name) private routeModel: Model<RouteDocument>) {}


async create(dto: any) {
const created = new this.routeModel(dto);
return created.save();
}

// Procura por origem e destino
async findMatches(origin: string, destination: string) {
return this.routeModel
.find({ origin: { $regex: origin, $options: 'i' }, destination: { $regex: destination, $options: 'i' } })
.lean();
}

async findByDriver(driverId: string) {
return this.routeModel.find({ driverId }).lean();
}
}