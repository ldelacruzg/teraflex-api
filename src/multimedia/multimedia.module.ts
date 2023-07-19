import { Module } from '@nestjs/common';
import { MultimediaController } from './controller/multimedia.controller';
import { MultimediaService } from './service/multimedia.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '@entities/link.entity';
import { MulterModule } from '@nestjs/platform-express';
import { CustomFileInterceptor } from './interceptor/custom-file.interceptor';
import { MultimediaRepository } from './service/multimedia.repository';

@Module({
  controllers: [MultimediaController],
  providers: [MultimediaService, MultimediaRepository],
  imports: [
    TypeOrmModule.forFeature([Link]),
    MulterModule.registerAsync({
      useClass: CustomFileInterceptor,
    }),
  ],
})
export class MultimediaModule {}
