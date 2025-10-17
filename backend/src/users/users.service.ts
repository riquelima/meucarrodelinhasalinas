import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }


    async create(dto: any) {

        if (await this.userModel.findOne({ email: dto.email })) {
            throw new Error('Email já cadastrado');
        }

        if (dto.roles && dto.roles.includes('motorista')) {


        }


        const hashed = await bcrypt.hash(dto.password, 10);
        const created = new this.userModel({ ...dto, password: hashed });
        return created.save();
    }


    async findByEmail(email: string) {
        return this.userModel.findOne({ email }).lean();
    }


    async findById(id: string) {
        return this.userModel.findById(id).lean();
    }


    async incrementProfileView(driverId: string) {
        return this.userModel.findByIdAndUpdate(driverId, { $inc: { profileViews: 1 } }, { new: true });
    }


    async updateRating(driverId: string, newAvg: number, totalReviews: number) {
        return this.userModel.findByIdAndUpdate(driverId, { avgRating: newAvg, totalReviews }, { new: true });
    }

    async findAll() {
        return this.userModel.find().lean();
    }
}