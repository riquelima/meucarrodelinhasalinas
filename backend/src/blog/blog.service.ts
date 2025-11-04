import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schemas/blog.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CloudinaryService } from 'src/config/cloudinary/cloudinary.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
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

    // Se isPublished não for definido, padrão é true (publicado)
    const isPublished = createBlogDto.isPublished !== undefined ? createBlogDto.isPublished : true;

    const created = new this.blogModel({
      ...createBlogDto,
      isPublished,
      image: imageUrl,
      image2: imageUrl2,
      image3: imageUrl3,
    });

    return created.save();
  }

  async findAll() {
    const blogs = await this.blogModel.find().sort({ createdAt: -1 }).lean().exec();

    if (!blogs || blogs.length === 0) return [];

    
    const authorIds = Array.from(new Set(blogs.map((b: any) => String(b.authorId))));
    const users = await this.userModel.find({ _id: { $in: authorIds } }).select('name').lean().exec();
    const usersById = new Map(users.map((u: any) => [String(u._id), u.name]));

    // Retorna blogs substituindo authorId por authorName
    return blogs.map((b: any) => {
      const authorName = usersById.get(String(b.authorId)) || null;
      const { authorId, ...rest } = b;
      return {
        ...rest,
        authorName,
      };
    });
  }

  async findOne(id: string) {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog não encontrado');
    return blog;
  }

  async countAll() {
    return this.blogModel.countDocuments();
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, file?: Express.Multer.File, file2?: Express.Multer.File, file3?: Express.Multer.File, removeImage?: boolean, removeImage2?: boolean, removeImage3?: boolean) {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog não encontrado');

    let imageUrl: string = blog.image;
    let imageUrl2: string | null = blog.image2 || null;
    let imageUrl3: string | null = blog.image3 || null;

    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'blog-images');
      imageUrl = uploadResult.secure_url;
    }

    if (removeImage2) {
      imageUrl2 = null;
    } else if (file2) {
      const uploadResult = await this.cloudinaryService.uploadImage(file2, 'blog-images');
      imageUrl2 = uploadResult.secure_url;
    }

    if (removeImage3) {
      imageUrl3 = null;
    } else if (file3) {
      const uploadResult = await this.cloudinaryService.uploadImage(file3, 'blog-images');
      imageUrl3 = uploadResult.secure_url;
    }

    if (updateBlogDto.title) blog.title = updateBlogDto.title;
    if (updateBlogDto.content) blog.content = updateBlogDto.content;
    if (updateBlogDto.category) blog.category = updateBlogDto.category;
    if (updateBlogDto.isPublished !== undefined) blog.isPublished = updateBlogDto.isPublished;
    if (updateBlogDto.link !== undefined) {
      blog.link = updateBlogDto.link === 'true' ? '' : updateBlogDto.link;
    }
    
    blog.image = imageUrl;
    (blog as any).image2 = imageUrl2;
    (blog as any).image3 = imageUrl3;

    return blog.save();
  }

  async findHomeBlogs() {
    const blogs = await this.blogModel.find().sort({ createdAt: -1 }).limit(3).lean().exec();
    if (!blogs || blogs.length === 0) return [];

    const authorIds = Array.from(new Set(blogs.map((b: any) => String(b.authorId))));
    const users = await this.userModel.find({ _id: { $in: authorIds } }).select('name').lean().exec();
    const usersById = new Map(users.map((u: any) => [String(u._id), u.name]));

    return blogs.map((b: any) => {
      const authorName = usersById.get(String(b.authorId)) || null;
      const { authorId, ...rest } = b;
      return {
        ...rest,
        authorName,
      };
    });
  }

  async updateViews(id: string) {
    const updated = await this.blogModel
      .findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Blog não encontrado');

    return updated;
  }

  async deleteById(id: string) {
    const deleted = await this.blogModel.findByIdAndDelete(id).exec();
    
    if (!deleted) {
      throw new NotFoundException('Blog não encontrado');
    }

    return { message: 'Blog deletado com sucesso' };
  }
}
