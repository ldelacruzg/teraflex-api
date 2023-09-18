import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '@shared/shared.module';
import { Environment } from '@shared/constants/environment';
import { User } from '@entities/user.entity';
import { Assignment } from '@entities/assignment.entity';
import { Category } from '@entities/category.entity';
import { Link } from '@entities/link.entity';
import { Task } from '@entities/task.entity';
import { TaskCategory } from '@entities/task-category.entity';
import { TaskMultimedia } from '@entities/task-multimedia.entity';
import { UserValidation } from '@entities/user-validation.entity';
import { SecurityModule } from '@security/security.module';
import { UserModule } from '@/users/user.module';
import { Group } from '@entities/group.entity';
import { ActivityModule } from '@/activities/activity.module';
import { MultimediaModule } from '@multimedia/multimedia.module';
import { NotificationModule } from '@/notifications/notification.module';
import { Notification } from '@entities/notification.entity';
import { NotificationToken } from '@entities/notification-token.entity';
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
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
