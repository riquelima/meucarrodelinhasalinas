import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoutesModule } from './routes/routes.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MessageModule } from './messages/messages.module';
import { AdsModule } from './ads/ads.module';
import { BlogModule } from './blog/blog.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/meu_carro_db'),
    AuthModule,
    UsersModule,
    //RoutesModule,
    ReviewsModule,
    MessageModule,
    AdsModule, 
    BlogModule, //FALTA IMPLEMENTAR
  ],
})
export class AppModule {}
