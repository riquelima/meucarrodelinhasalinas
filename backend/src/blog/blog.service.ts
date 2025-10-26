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
  ) { }

  async create(createBlogDto: CreateBlogDto, file?: Express.Multer.File, file2?: Express.Multer.File, file3?: Express.Multer.File) {
    let imageUrl: string | null = null;
    let imageUrl2: string | null = null;
    let imageUrl3: string | null = null;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'blog-images');
      imageUrl = uploadResult.secure_url;
    }

    if (file2) {
      const uploadResult = await this.cloudinaryService.uploadImage(file2, 'blog-images');
      imageUrl2 = uploadResult.secure_url;
    }

    if (file3) {
      const uploadResult = await this.cloudinaryService.uploadImage(file3, 'blog-images');
      imageUrl3 = uploadResult.secure_url;
    }

    const created = new this.blogModel({
      ...createBlogDto,
      image: imageUrl,
      image2: imageUrl2,
      image3: imageUrl3,
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

  async findHomeBlogs() {
    return this.blogModel.find().sort({ createdAt: -1 }).limit(3).exec();
  }
}
