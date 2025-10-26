import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createBlogDto: CreateBlogDto, file?: Express.Multer.File) {
    let imageUrl: string | null = null;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'blog-images');
      imageUrl = uploadResult.secure_url;
    }

    const created = new this.blogModel({
      ...createBlogDto,
      image: imageUrl,
    });

    return created.save();
  }

  async findAll() {
    return this.blogModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog não encontrado');
    return blog;
  }

  async countAll() {
    return this.blogModel.countDocuments();
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, file?: Express.Multer.File) {
  const blog = await this.blogModel.findById(id);
  if (!blog) throw new NotFoundException('Blog não encontrado');

  let imageUrl = blog.image;

  // Se o usuário enviou uma nova imagem, substitui no Cloudinary
  if (file) {
    const uploadResult = await this.cloudinaryService.uploadImage(file, 'blog-images');
    imageUrl = uploadResult.secure_url;
  }

  Object.assign(blog, {
    ...updateBlogDto,
    image: imageUrl,
  });

  return blog.save();
}
}
