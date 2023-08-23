import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Environment } from '@shared/constants/environment';

@Injectable()
export class CustomFileInterceptor implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: Environment.PUBLIC_DIR,
        filename: (req, file, cb) => {
          file.originalname = file.originalname.replace(/\s/g, '_');
          const newName = `${file.originalname.split('.')[0]}_${Date.now()}`;
          cb(null, `${newName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);

        const allowedExtensions = [
          '.jpeg',
          '.png',
          '.jpg',
          '.mp4',
          '.mov',
          '.avi',
          '.mkv',
        ];

        if (!allowedExtensions.includes(ext)) {
          cb(new Error('Sólo se aceptan videos e imágenes'), false);
        } else cb(null, true);
      },
      limits: {
        fileSize: Environment.FILE_SIZE * 1000000, // Tamaño máximo del archivo (en bytes)
        files: 5, // Número máximo de archivos,
      },
    };
  }
}
