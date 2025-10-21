import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ads, AdsDocument } from './schemas/ads.schema';
import { CreateAdsDto } from './dto/create-ads.dto';
import { UpdateAdsDto } from './dto/update-ads.dto';

@Injectable()
export class AdsService {
    constructor(
        @InjectModel(Ads.name)
        private readonly adsModel: Model<AdsDocument>,
    ) { }

    // Criar novo anúncio
    async create(createAdsDto: CreateAdsDto, userId: string) {
        const ad = new this.adsModel({ ...createAdsDto, userId });
        return ad.save();
    }

    async getRandomActiveAds(limit = 5) {
        return this.adsModel.aggregate([
            { $match: { isActive: true } },
            { $sample: { size: limit } },
            {
                $project: {
                    nameCompany: 1,
                    description: 1,
                    urlImage: 1,
                    numberPhone: 1,
                },
            },
        ]);
    }
   
    async getUserAds(userId: string) {
        return this.adsModel.find({ userId: new Types.ObjectId(userId) }).lean();
    }
    
    async getUserKpis(userId: string) {
        const userObjectId = new Types.ObjectId(userId);

        const [stats] = await this.adsModel.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: null,
                    totalAds: { $sum: 1 },
                    activeAds: { $sum: { $cond: ['$isActive', 1, 0] } },
                    totalViews: { $sum: '$views' },
                },
            },
        ]);
        
        const conversionRate =
            stats && stats.totalAds > 0 ? (stats.totalViews / stats.totalAds).toFixed(2) : 0;

        return {
            totalAds: stats?.totalAds || 0,
            activeAds: stats?.activeAds || 0,
            totalViews: stats?.totalViews || 0,
            conversionRate,
        };
    }

    async updateAd(id: string, updateDto: UpdateAdsDto, userId: string) {
        return this.adsModel.findOneAndUpdate(
            { _id: id, userId: userId },
            { $set: updateDto },
            { new: true },
        );
    }
    
    async incrementViews(adId: string) {
        return this.adsModel.findByIdAndUpdate(adId, { $inc: { views: 1 } }, { new: true });
    }
}
