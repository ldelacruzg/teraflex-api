import { Injectable } from '@nestjs/common';
import { NotificationToken } from '@entities/notification-token.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class NotificationTokenRepository {
  async create(cnx: EntityManager, data: NotificationToken) {
    const object = cnx.create(NotificationToken, data);

    return await cnx.save(object);
  }

  async getByDevice(cxn: EntityManager, device: string) {
    return await cxn.findOne(NotificationToken, { where: { device } });
  }

  async getByUser(cxn: EntityManager, userId: number, status?: boolean) {
    return await cxn.find(NotificationToken, {
      where: { userId, status: status == undefined ? true : status },
    });
  }

  async update(cnx: EntityManager, id: number, data: NotificationToken) {
    return await cnx.update(NotificationToken, id, data);
  }
}
