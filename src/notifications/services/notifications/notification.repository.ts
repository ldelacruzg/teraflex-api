import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Notification } from '@entities/notification.entity';

@Injectable()
export class NotificationRepository {
  async insert(cnx: EntityManager, data: Notification) {
    const newNotification = cnx.create(Notification, data);
    return await cnx.save(newNotification);
  }

  async getByUser(cnx: EntityManager, userId: number, status?: boolean) {
    return await cnx.find(Notification, {
      where: { userId, status: status == undefined ? true : status },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(cnx: EntityManager, id: number, status: boolean) {
    return await cnx.update(Notification, id, { status });
  }

  async getById(cnx: EntityManager, id: number) {
    return await cnx.findOneBy(Notification, { id });
  }
}
