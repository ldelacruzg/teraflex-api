import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { Environment } from './shared/constants/environment';
import { User } from './entities/user.entity';
import { Assignment } from './entities/assignment.entity';
import { Category } from './entities/category.entity';
import { Link } from './entities/link.entity';
import { MultimediaType } from './entities/multimedia-type.entity';
import { Task } from './entities/task.entity';
import { TaskCategory } from './entities/task-category.entity';
import { TaskMultimedia } from './entities/task-multimedia.entity';
import { UserValidation } from './entities/user-validation.entity';
import { SecurityModule } from './security/security.module';
import { UserModule } from './user/user.module';
import { Group } from './entities/group.entity';
import { ActivityModule } from './activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Environment.DATABASE_HOST,
      port: Environment.DATABASE_PORT as number,
      username: Environment.DATABASE_USERNAME,
      password: Environment.DATABASE_PASSWORD,
      database: Environment.DATABASE_NAME,
      entities: [
        Assignment,
        Category,
        Link,
        MultimediaType,
        Task,
        TaskCategory,
        TaskMultimedia,
        User,
        UserValidation,
        Group,
      ],
      synchronize: false,
      ssl: Environment.DATABASE_SSL as boolean,
      logging: ['error', 'warn'],
      retryAttempts: 5,
      cache: {
        duration: 300000,
        alwaysEnabled: true,
      },
    }),
    SharedModule,
    SecurityModule,
    UserModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
