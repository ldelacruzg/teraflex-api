import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import { Environment } from '@shared/constants/environment';
import { GamificationModule } from '@gamification/gamification.module';

import {
  Assignment,
  Category,
  Link,
  Task,
  TaskCategory,
  TaskMultimedia,
  User,
  UserValidation,
  Group,
  Notification,
  NotificationToken,
  Patient,
  Treatment,
  Streak,
  StoreItem,
  PurchasedItem,
  UseStoreItem,
  Leaderboard,
  PatientLeaderboard,
  AssignmentConfiguration,
} from '@/entities';

import { SecurityModule } from '@security/security.module';
import { UserModule } from '@/users/user.module';
import { ActivityModule } from '@/activities/activity.module';
import { MultimediaModule } from '@multimedia/multimedia.module';
import { NotificationModule } from '@/notifications/notification.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Environment.DATABASE_HOST,
      port: Environment.DATABASE_PORT,
      username: Environment.DATABASE_USERNAME,
      password: Environment.DATABASE_PASSWORD,
      database: Environment.DATABASE_NAME,
      entities: [
        Assignment,
        Category,
        Link,
        Task,
        TaskCategory,
        TaskMultimedia,
        User,
        UserValidation,
        Group,
        Notification,
        NotificationToken,
        Patient,
        Treatment,
        Streak,
        StoreItem,
        PurchasedItem,
        UseStoreItem,
        Leaderboard,
        PatientLeaderboard,
        AssignmentConfiguration,
      ],
      synchronize: Environment.DATABASE_SYNC,
      ssl: Environment.DATABASE_SSL,
      logging: ['error', 'warn'],
      retryAttempts: 5,
      cache: true,
    }),
    SharedModule,
    SecurityModule,
    UserModule,
    ActivityModule,
    MultimediaModule,
    NotificationModule,
    GamificationModule,
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
