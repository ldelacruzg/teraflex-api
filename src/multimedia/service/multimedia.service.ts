import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { MultimediaRepository } from './multimedia.repository';
import { Link } from '../../entities/link.entity';
import { extname } from 'path';
import { Environment } from '../../shared/constants/environment';

@Injectable()
export class MultimediaService {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    private repo: MultimediaRepository,
  ) {}

  async saveMultimedia(file: Express.Multer.File, currentUserId: number) {
    try {
      const payload = {
        url: file.filename,
        type: extname(file.filename).replace('.', ''),
        createdById: currentUserId,
      } as Link;

      const created = await this.repo.create(this.entityManager, payload);

      if (!created) throw new Error('Error al guardar recurso');

      return created;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async saveMultimediaOnline(data: { url: string; createdById: number }) {
    try {
      const payload = {
        ...data,
        type: 'online',
      } as Link;

      const created = await this.repo.create(this.entityManager, payload);

      if (!created) throw new Error('Error al guardar recurso');

      return created;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async getMultimedia(id: number) {
    try {
      const multimedia = await this.repo.get(this.entityManager, id);

      if (!multimedia) throw new Error('Recurso no encontrado');

      return {
        buffer: await fs.readFileSync(
          `${Environment.PUBLIC_DIR}/${multimedia.url}`,
        ),
        name: multimedia.url,
      };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
