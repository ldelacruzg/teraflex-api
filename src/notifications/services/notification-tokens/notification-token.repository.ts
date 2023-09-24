import { Injectable } from '@nestjs/common';
import { NotificationToken } from '@entities/notification-token.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class NotificationTokenRepository {
  async create(cnx: EntityManager, data: NotificationToken) {
    const object = cnx.create(NotificationToken, data);

    return await cnx.save(object);
  }

  async getByDevice(cnx: EntityManager, device: string, status?: boolean) {
    const query = cnx
      .createQueryBuilder()
      .select([
        'notificationToken.id as id',
        'notificationToken.token as token',
        'notificationToken.device as device',
        'notificationToken.status as status',
        'notificationToken.user_id as "userId"',
      ])
      .from(NotificationToken, 'notificationToken')
      .where('notificationToken.device = :device', { device });

    if (status != undefined)
      query.andWhere('notificationToken.status = :status', { status });

    return await query.getRawOne<{
      id: number;
      token: string;
      device: string;
      status: boolean;
      userId: number;
    }>();
  }

  async getByUser(cxn: EntityManager, userId: number, status?: boolean) {
    return await cxn.find(NotificationToken, {
      where: { userId, status: status },
    });
  }

  async update(cnx: EntityManager, id: number, data: NotificationToken) {
    return await cnx.update(NotificationToken, id, data);
  }

  async getByToken(cnx: EntityManager, token: string) {
    return await cnx.findOne(NotificationToken, { where: { token } });
  }
}
