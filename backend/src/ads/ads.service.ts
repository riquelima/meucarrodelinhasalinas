import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ads, AdsDocument } from './schemas/ads.schema';
import { CreateAdsDto } from './dto/create-ads.dto';
import { UpdateAdsDto } from './dto/update-ads.dto';
import { UsersService } from 'src/users/users.service';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';


@Injectable()
export class AdsService {
    constructor(
        @InjectModel(Ads.name)
        private readonly adsModel: Model<AdsDocument>,
        private readonly usersService: UsersService,
        private readonly cloudinaryService: CloudinaryService,
    ) { }

    // Criar novo anúncio
    async create(createAdsDto: CreateAdsDto, userId: string, file: Express.Multer.File) {

        const user = await this.usersService.findById(userId);
        let imageUrl: string | null = null;

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        if (user.role !== 'anunciante' && user.role !== 'admin') {
            throw new NotFoundException('Apenas anunciantes ou administradores podem criar anúncios');
        }       


        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file, 'blog-images');
            imageUrl = uploadResult.secure_url;
        }

        const ad = new this.adsModel({ ...createAdsDto, userId, image: imageUrl });
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

    async updateAd(id: string, updateDto: UpdateAdsDto, file?: Express.Multer.File) {

        const ad = await this.adsModel.findById(id);
        if (!ad) throw new NotFoundException('Anúncio não encontrado');

        if (file) {
            const image = await this.cloudinaryService.uploadImage(file, 'ads');
            updateDto.image = image.secure_url;
        }

        return this.adsModel.findOneAndUpdate(
            { _id: id },
            { $set: updateDto },
            { new: true },
        );
    }

    async incrementViews(adId: string) {
        const ad = await this.adsModel.findById(adId);
        if (!ad) throw new NotFoundException('Anúncio não encontrado');

        return this.adsModel.findByIdAndUpdate(adId, { $inc: { views: 1 } }, { new: true });
    }

    async getAdsCount() {
        return this.adsModel.countDocuments();
    }
}
