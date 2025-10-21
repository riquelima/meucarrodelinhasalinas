import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { UsersService } from '../users/users.service';
import { CreateReviewDto } from './dto/create-reviews.dto';


@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>, private usersService: UsersService) { }


    async create(createReviewDto: CreateReviewDto) {

        //salva na tabela de reviews
        const created = new this.reviewModel(createReviewDto);
        const saved = await created.save();

        //atualiza a média e total de reviews do usuario avaliado
        const receiverId = createReviewDto.receiverId;
        const reviews = await this.reviewModel.find({ receiverId }).lean();

        const totalReviews = reviews.length;
        const avg = reviews.reduce((s, r) => s + r.rating, 0) / totalReviews;
        await this.usersService.updateRating(receiverId, avg, totalReviews);

        return saved;
    }


    async findForDriver(driverId: string) {
        return this.reviewModel.find({ driverId }).lean();
    }
}