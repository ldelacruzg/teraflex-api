import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@entities/category.entity';
import { TaskCategory } from '@entities/task-category.entity';
import { Task } from '@/activities/tasks/domain/task.entity';
import { User } from '@entities/user.entity';
import { CategoryService } from './services/category/category.service';
import { CategoryController } from './controllers/category/category.controller';
import { Link } from '@entities/link.entity';
import { TaskMultimedia } from '@entities/task-multimedia.entity';
import { NotificationModule } from '@notifications/notification.module';
import { UserModule } from '@users/user.module';
import {
  Treatment,
  TreatmentController,
  TreatmentRepository,
  TreatmentRepositoryTypeOrmPostgres,
  TreatmentService,
} from './treatments';
import { GamificationModule } from '@/gamification/gamification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      Category,
      TaskCategory,
      User,
      Link,
      TaskMultimedia,
      Treatment,
    ]),
    NotificationModule,
    UserModule,
    GamificationModule,
  ],
  providers: [
    CategoryService,
    TreatmentService,
    {
      provide: TreatmentRepository,
      useClass: TreatmentRepositoryTypeOrmPostgres,
    },
  ],
  controllers: [CategoryController, TreatmentController],
})
export class ActivityModule {}
