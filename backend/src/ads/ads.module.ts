import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdsController } from './ads.controller';
import { AdsService } from './ads.service';
import { Ads, AdsSchema } from './schemas/ads.schema';
import { UsersModule } from 'src/users/users.module';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ads.name, schema: AdsSchema }]),
    UsersModule,
  ],
  controllers: [AdsController],
  providers: [AdsService, CloudinaryService],
  exports: [AdsService],
})
export class AdsModule {}
