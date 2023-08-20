import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification/notification.controller';
import { NotificationTokenController } from './controllers/notification-token/notification-token.controller';
import { NotificationTokenService } from './services/notification-tokens/notification-token.service';
import { NotificationService } from './services/notifications/notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '@entities/notification.entity';
import { NotificationToken } from '@entities/notification-token.entity';
import { NotificationTokenRepository } from '@notifications/services/notification-tokens/notification-token.repository';
import { SharedModule } from '@shared/shared.module';
import { NotificationRepository } from '@notifications/services/notifications/notification.repository';

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
