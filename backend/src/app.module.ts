import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
//import { RoutesModule } from './routes/routes.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MessageModule } from './messages/messages.module';
import { AdsModule } from './ads/ads.module';
import { BlogModule } from './blog/blog.module';
import { EmailModule } from './email/email.module';


import { APP_CONFIG } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(APP_CONFIG.MONGO_URI),
    AuthModule,
    UsersModule,
    //RoutesModule,
    ReviewsModule,
    MessageModule,
    AdsModule,
    BlogModule,
    EmailModule,
  ],
})
export class AppModule { }
