import { Module } from '@nestjs/common';
import { MultimediaController } from './controllers/multimedia.controller';
import { MultimediaService } from './services/multimedia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '@entities/link.entity';
import { MulterModule } from '@nestjs/platform-express';
import { CustomFileInterceptor } from './interceptors/custom-file.interceptor';
import { MultimediaRepository } from './services/multimedia.repository';

@Module({
  controllers: [MultimediaController],
  providers: [MultimediaService, MultimediaRepository],
  imports: [
    TypeOrmModule.forFeature([Link]),
    MulterModule.registerAsync({
      useClass: CustomFileInterceptor,
    }),
  ],
  exports: [MultimediaRepository],
})
export class MultimediaModule {}
