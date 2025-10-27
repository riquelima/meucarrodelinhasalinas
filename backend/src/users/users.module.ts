import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MotoristaSchema } from './schemas/motorista.schema';
import mongoose from 'mongoose';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CloudinaryService,
    {
      provide: 'MOTORISTA_MODEL',
      useFactory: (userModel: mongoose.Model<any>) =>
        userModel.discriminator('motorista', MotoristaSchema),
      inject: [getModelToken(User.name)],
    },    
  ],
  exports: [UsersService, 'MOTORISTA_MODEL'],
})
export class UsersModule {}
