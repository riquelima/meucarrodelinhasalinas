import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteImageByPublicId(publicId: string) {
    if (!publicId) return null;
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, { resource_type: 'image', invalidate: true }, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }


  async deleteImageByUrl(url?: string) {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      const afterUpload = parsed.pathname.split('/upload/')[1];
      if (!afterUpload) return null;

      const withoutQuery = afterUpload.split('?')[0];
      const withoutExt = withoutQuery.replace(/\.[^/.]+$/, '');
      const parts = withoutExt.split('/').filter(Boolean);
      if (parts.length === 0) return null;

      const basename = parts[parts.length - 1];
      let publicId = basename;
      if (parts.length >= 2) {
        const parent = parts[parts.length - 2];
        publicId = `${parent}/${basename}`;
      }

      try {
        const res = await this.deleteImageByPublicId(publicId);
        return res;
      } catch (err) {
        try {
          return await this.deleteImageByPublicId(basename);
        } catch (err2) {
          console.error('Error deleting image by public id or basename:', err, err2);
          return null;
        }
      }
    } catch (err) {
      console.error('Error deleting image by URL:', err);
      return null;
    }
  }
}
