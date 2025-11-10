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

  async getTotalViews() {
    const result = await this.blogModel.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    return result.length > 0 ? result[0].totalViews : 0;
  }

  async getViewsMonthlyGrowth() {
    const now = new Date();
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const currentMonthTotal = await this.blogModel.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    const previousMonthTotal = await this.blogModel.aggregate([
      {
        $match: {
          createdAt: { $lte: previousMonthEnd }
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' }
        }
      }
    ]);

    const currentTotal = currentMonthTotal.length > 0 ? currentMonthTotal[0].totalViews : 0;
    const previousTotal = previousMonthTotal.length > 0 ? previousMonthTotal[0].totalViews : 0;

    let growth = 0;
    if (previousTotal > 0) {
      growth = ((currentTotal - previousTotal) / previousTotal) * 100;
    } else if (previousTotal === 0 && currentTotal > 0) {
      growth = 0; // Não há dados anteriores para comparar
    }

    return {
      currentMonth: currentTotal,
      previousMonth: previousTotal,
      growth: Math.round(growth * 100) / 100
    };
  }

  async update(id: string, updateBlogDto: UpdateBlogDto, file?: Express.Multer.File, file2?: Express.Multer.File, file3?: Express.Multer.File) {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog não encontrado');

    let imageUrl: string = blog.image;
    let imageUrl2: string | null = blog.image2 || null;
    let imageUrl3: string | null = blog.image3 || null;

    if (file) {
      // upload new primary image first
      const uploadResult = await this.cloudinaryService.uploadImage(file, 'blog-images');
      const newImageUrl = uploadResult.secure_url;


      if (blog.image) {
        try { await this.cloudinaryService.deleteImageByUrl(blog.image); } catch (err) { console.log(err); }
      }

      imageUrl = newImageUrl;
    }

    if (file2) {

      const uploadResult2 = await this.cloudinaryService.uploadImage(file2, 'blog-images');
      const newImageUrl2 = uploadResult2.secure_url;

      if (blog.image2) {
        try { await this.cloudinaryService.deleteImageByUrl(blog.image2); } catch (err) { }
      }

      imageUrl2 = newImageUrl2;
    } else {
      // no file2 provided -> remove existing image2 if present
      if (blog.image2) {
        try { await this.cloudinaryService.deleteImageByUrl(blog.image2); } catch (err) { }
      }
      imageUrl2 = null;
    }

    // For image3: same rule as image2
    if (file3) {
      // upload new tertiary image first
      const uploadResult3 = await this.cloudinaryService.uploadImage(file3, 'blog-images');
      const newImageUrl3 = uploadResult3.secure_url;

      if (blog.image3) {
        try { await this.cloudinaryService.deleteImageByUrl(blog.image3); } catch (err) { }
      }

      imageUrl3 = newImageUrl3;
    } else {
      if (blog.image3) {
        try { await this.cloudinaryService.deleteImageByUrl(blog.image3); } catch (err) { }
      }
      imageUrl3 = null;
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

    // delete associated images from Cloudinary
    try { if (deleted.image) await this.cloudinaryService.deleteImageByUrl(deleted.image); } catch (err) {}
    try { if ((deleted as any).image2) await this.cloudinaryService.deleteImageByUrl((deleted as any).image2); } catch (err) {}
    try { if ((deleted as any).image3) await this.cloudinaryService.deleteImageByUrl((deleted as any).image3); } catch (err) {}

    return { message: 'Blog deletado com sucesso' };
  }

  async getMonthlyGrowth() {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const currentMonthCount = await this.blogModel.countDocuments({
      createdAt: { $gte: currentMonthStart }
    });

    const previousMonthCount = await this.blogModel.countDocuments({
      createdAt: { 
        $gte: previousMonthStart,
        $lt: currentMonthStart
      }
    });

    const growth = previousMonthCount > 0 
      ? ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
      : (currentMonthCount > 0 ? 100 : 0);

    return {
      currentMonth: currentMonthCount,
      previousMonth: previousMonthCount,
      growth: Math.round(growth * 100) / 100
    };
  }

  async getChartData(months: number = 4) {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    const monthsArray: Array<{ month: string; count: number }> = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      const monthName = date.toLocaleString('pt-BR', { month: 'short' });

      const monthCount = await this.blogModel.countDocuments({
        createdAt: { 
          $gte: startDate,
          $lte: monthEnd
        }
      });

      monthsArray.push({
        month: monthName,
        count: monthCount
      });
    }

    return monthsArray;
  }
}
