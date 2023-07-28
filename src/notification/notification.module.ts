import { Module } from '@nestjs/common';
import { NotificationController } from './controller/notification/notification.controller';
import { NotificationTokenController } from './controller/notification-token/notification-token.controller';
import { NotificationTokenService } from './service/notification-token/notification-token.service';
import { NotificationService } from './service/notification/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '@entities/notification.entity';
import { NotificationToken } from '@entities/notification-token.entity';
import { NotificationTokenRepository } from '@notification/service/notification-token/notification-token.repository';
import { SharedModule } from '@shared/shared.module';
import { NotificationRepository } from '@notification/service/notification/notification.repository';

@Module({
  controllers: [NotificationController, NotificationTokenController],
  providers: [
    NotificationTokenService,
    NotificationService,
    NotificationTokenRepository,
    NotificationRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationToken]),
    SharedModule,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
