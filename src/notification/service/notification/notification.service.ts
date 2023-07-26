import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationTokenService } from '@notification/service/notification-token/notification-token.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  insertFailed,
  insertSucessful,
  updateSucessful,
} from '@shared/constants/messages';
import { NotificationRepository } from '@notification/service/notification/notification.repository';
import { Notification } from '@entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationTokenService: NotificationTokenService,
    @InjectEntityManager() private readonly cnx: EntityManager,
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async sendNotification(
    userId: number,
    payload: { title: string; body: string },
  ) {
    try {
      const devices = await this.notificationTokenService.getByUser(userId);

      for (const device of devices) {
        console.log(device, payload);
      }

      return await this.saveNotification({
        ...payload,
        userId,
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  private async saveNotification(payload: {
    title: string;
    body: string;
    userId: number;
  }) {
    const inserted = await this.notificationRepository.insert(
      this.cnx,
      payload as Notification,
    );

    if (!inserted) {
      throw new BadRequestException(insertFailed('notification'));
    }

    return insertSucessful('notification');
  }

  async getNotifications(userId: number) {
    const notifications = await this.notificationRepository.getByUser(
      this.cnx,
      userId,
    );

    if (!notifications) {
      throw new NotFoundException('No notifications found');
    }

    return notifications;
  }

  async deleteNotification(id: number) {
    const notification = await this.notificationRepository.getById(
      this.cnx,
      id,
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const deleted = await this.notificationRepository.updateStatus(
      this.cnx,
      id,
      false,
    );

    if (deleted.affected === 0) {
      throw new BadRequestException('La notificación no pudo ser eliminada');
    }

    return updateSucessful('notification');
  }
}
