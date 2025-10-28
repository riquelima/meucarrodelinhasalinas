import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schemas/blog.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
  ], 
  controllers: [BlogController],
  providers: [BlogService, CloudinaryService],
  exports: [BlogService],
})
export class BlogModule {}
