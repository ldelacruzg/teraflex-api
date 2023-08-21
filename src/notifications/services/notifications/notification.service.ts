import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationTokenService } from '@/notifications/services/notification-tokens/notification-token.service';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import {
  insertFailed,
  insertSucessful,
  updateSucessful,
} from '@shared/constants/messages';
import { NotificationRepository } from '@/notifications/services/notifications/notification.repository';
import { Notification } from '@entities/notification.entity';
import firebase from 'firebase-admin';
import { NotificationTokenRepository } from '@/notifications/services/notification-tokens/notification-token.repository';
import { NotificationToken } from '@entities/notification-token.entity';
import { Environment } from '@/shared/constants/environment';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationTokenService: NotificationTokenService,
    @InjectEntityManager() private readonly cnx: EntityManager,
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationTokenRepository: NotificationTokenRepository,
  ) {
    firebase.initializeApp({
      credential: firebase.credential.cert(Environment.FIREBASE_CONFIG),
    });
  }

  async sendNotification(
    userId: number,
    payload: { title: string; body: string },
  ) {
    const devices = await this.notificationTokenService.getByUser(userId, true);

    if (devices.length === 0) return null;

    const tokens = devices.map((device) => device.token);

    await firebase
      .messaging()
      .sendEachForMulticast({
        notification: { ...payload },
        tokens,
      })
      .then(async (response) => {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            this.notificationTokenRepository.update(this.cnx, devices[idx].id, {
              status: false,
            } as NotificationToken);
          }
        });
      })
      .catch(async (error: any) => {
        console.error(error);
      });

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
      throw new NotFoundException('No se encontraron notificaciones');
    }

    return notifications;
  }

  async deleteNotification(id: number) {
    const notification = await this.notificationRepository.getById(
      this.cnx,
      id,
    );

    if (!notification) {
      throw new NotFoundException('No se encontró la notificación');
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
