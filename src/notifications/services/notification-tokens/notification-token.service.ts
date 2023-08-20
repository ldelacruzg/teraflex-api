import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationTokenRepository } from '@notifications/services/notification-tokens/notification-token.repository';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { CreateNotificationTokenDto } from '@notifications/controllers/notification-token/dtos/create-notification-token.dto';
import { NotificationToken } from '@entities/notification-token.entity';
import {
  insertFailed,
  insertSucessful,
  notFound,
  updateFailed,
  updateSucessful,
} from '@shared/constants/messages';
import { EncryptService } from '@shared/services/encrypt.service';

@Injectable()
export class NotificationTokenService {
  constructor(
    private readonly notificationTokenRepository: NotificationTokenRepository,
    @InjectEntityManager() private readonly cnx: EntityManager,
    private readonly encryptService: EncryptService,
  ) {}

  async registerDevice(data: CreateNotificationTokenDto) {
    return await this.cnx.transaction(async (manager) => {
      data.device = await this.encryptService.encrypt(data.device);

      const exist = await this.notificationTokenRepository.getByDevice(
        manager,
        data.device,
      );

      if (!exist) {
        const created = await this.notificationTokenRepository.create(
          manager,
          data as NotificationToken,
        );

        if (!created)
          throw new BadRequestException(insertFailed('notification token'));

        return insertSucessful('notification token');
      } else {
        if (!exist.status) {
          const updated = await this.notificationTokenRepository.update(
            manager,
            exist.id,
            {
              status: true,
            } as NotificationToken,
          );

          if (updated.affected === 0)
            throw new BadRequestException(updateFailed('notification token'));

          return updateSucessful('notification token');
        } else
          throw new BadRequestException(
            'El dispositivo ya se encuentra registrado',
          );
      }
    });
  }

  async getByDevice(device: string, status?: boolean) {
    const notificationToken =
      await this.notificationTokenRepository.getByDevice(
        this.cnx,
        await this.encryptService.encrypt(device),
        status,
      );

    if (!notificationToken) {
      throw new NotFoundException(notFound('Dispositivo'));
    }

    return notificationToken;
  }

  async getByUser(userId: number, status?: boolean) {
    const notificationTokens = await this.notificationTokenRepository.getByUser(
      this.cnx,
      userId,
      status,
    );

    if (!notificationTokens) {
      throw new NotFoundException(notFound('notification token'));
    }

    return notificationTokens;
  }

  async updateStatus(device: string, currentUserId: number, status?: boolean) {
    const notificationToken = await this.getByDevice(device);

    if (notificationToken.userId !== currentUserId)
      throw new BadRequestException(
        'No puedes actualizar el estado de un dispositivo que no te pertenece',
      );

    const updated = await this.notificationTokenRepository.update(
      this.cnx,
      notificationToken.id,
      { status: status ?? !notificationToken.status } as NotificationToken,
    );

    if (updated.affected === 0) {
      throw new BadRequestException(updateFailed('notification token'));
    }

    return updateSucessful('notification token');
  }
}
