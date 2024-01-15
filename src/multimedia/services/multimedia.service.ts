import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import fs from 'fs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MultimediaRepository } from './multimedia.repository';
import { Link } from '@entities/link.entity';
import { extname } from 'path';
import { Environment } from '@shared/constants/environment';
import { updateFailed, updateSucessful } from '@shared/constants/messages';
import {
  CreateLinkDto,
  uploadMultimediaDto,
} from '../controllers/dtos/create-link.dto';
import { UpdateLinkDto } from '../controllers/dtos/update-link.dto';

@Injectable()
export class MultimediaService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    private repo: MultimediaRepository,
  ) {}

  async saveMultimedia(
    files: Express.Multer.File[],
    data: uploadMultimediaDto,
    currentUserId: number,
  ) {
    return await this.entityManager.transaction(async (manager) => {
      const ids: {
        id: number;
        title: string;
        url: string;
      }[] = [];

      for (const file of files) {
        const payload = {
          url: `${Environment.HOSTNAME}/${Environment.PUBLIC_DIR}/${file.filename}`,
          type: extname(file.filename).replace('.', ''),
          createdById: currentUserId,
          isPublic: data.isPublic,
          description: data.description,
          title: data.title,
        } as Link;

        const created = await this.repo.create(manager, payload);

        if (!created) throw new BadRequestException('Error al guardar recurso');

        ids.push({ id: created.id, title: created.title, url: created.url });
      }

      return ids;
    });
  }

  async saveMultimediaOnline(data: CreateLinkDto) {
    return await this.entityManager.transaction(async (manager) => {
      const payload = {
        ...data,
        type: 'online',
      } as Link;

      const created = await this.repo.create(manager, payload);

      if (!created) throw new BadRequestException('Error al guardar recurso');

      return { id: created.id, title: created.title, url: created.url };
    });
  }

  async getMultimedia(id: number) {
    const multimedia = await this.repo.getById(this.entityManager, id);

    if (!multimedia) throw new NotFoundException('Recurso no encontrado');

    const filePath = `${Environment.PUBLIC_DIR}/${multimedia.url}`;

    if (multimedia.type === 'online')
      throw new BadRequestException('Recurso no descargable');

    const exist = fs.existsSync(filePath);
    if (!exist) {
      await this.updateStatus(id);
      throw new InternalServerErrorException('Recurso no disponible');
    }

    return {
      buffer: fs.readFileSync(filePath),
      name: multimedia.url,
    };
  }

  async getByUserAndPublic(id: number, status: boolean) {
    const multimedia = await this.repo.getByUserAndPublic(
      this.entityManager,
      id,
      status,
    );

    if (!multimedia)
      throw new NotFoundException('No se encontraron los recursos');

    return multimedia;
  }

  async update(id: number, payload: UpdateLinkDto) {
    return await this.entityManager.transaction(async (manager) => {
      const file = await this.repo.getById(manager, id);

      if (!file) throw new NotFoundException('Recurso no encontrado');

      const updated = await this.repo.update(manager, id, payload as Link);

      if (!updated)
        throw new HttpException(
          updateFailed('Recurso'),
          HttpStatus.NOT_MODIFIED,
        );

      return updateSucessful('Recurso');
    });
  }

  async updateStatus(id: number) {
    return await this.entityManager.transaction(async (manager) => {
      const file = await this.repo.getById(manager, id);

      if (!file) throw new NotFoundException('Recurso no encontrado');

      const updated = await this.repo.update(manager, id, {
        status: !file.status,
      } as Link);

      if (!updated)
        throw new HttpException(
          updateFailed('Recurso'),
          HttpStatus.NOT_MODIFIED,
        );

      return updateSucessful('Recurso');
    });
  }
}
