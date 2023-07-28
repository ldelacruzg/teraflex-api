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
import firebase from 'firebase-admin';
import * as path from 'path';
import { NotificationTokenRepository } from '@notification/service/notification-token/notification-token.repository';
import { NotificationToken } from '@entities/notification-token.entity';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationTokenService: NotificationTokenService,
    @InjectEntityManager() private readonly cnx: EntityManager,
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationTokenRepository: NotificationTokenRepository,
  ) {
    firebase.initializeApp({
      credential: firebase.credential.cert(
        path.join(__dirname, '../../../../firebase.json'),
      ),
    });
  }

  async sendNotification(
    userId: number,
    payload: { title: string; body: string },
  ) {
    const devices = await this.notificationTokenService.getByUser(userId);

    for (const device of devices) {
      await firebase
        .messaging()
        .send({
          notification: { ...payload },
          token: device.token,
          android: { priority: 'high' },
        })
        .catch(async (error: any) => {
          console.error(error);
          await this.notificationTokenRepository.update(this.cnx, device.id, {
            status: false,
          } as NotificationToken);
        });
    }

    return await this.saveNotification({
      ...payload,
      userId,
    });
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
