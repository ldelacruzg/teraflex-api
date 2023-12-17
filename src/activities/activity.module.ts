import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './services/category/category.service';
import { CategoryController } from './controllers/category/category.controller';
import { UserModule } from '@users/user.module';
import { NotificationModule } from '@notifications/notification.module';
import { GamificationModule } from '@/gamification/gamification.module';
import { Category, TaskCategory } from '@/entities';

import {
  Treatment,
  TreatmentController,
  TreatmentRepository,
  TreatmentRepositoryTypeOrmPostgres,
  TreatmentService,
} from './treatments';

import {
  Task,
  TaskController,
  TaskRepositoryTypeOrmPostgres,
  TaskRespository,
  TaskService,
} from './tasks';

import {
  TreatmentTasks,
  TreatmentTaskController,
  TreatmentTaskService,
  TreatmentTaskRepositoryTypeOrmPostgres,
  TreatmentTaskRepository,
} from './treatment-tasks';

import { CategoryRepository } from './repositories/category/category.respository';
import { CategoryRepositoryTypeOrmPostgres } from './repositories/category/category-typeorm-postgres.repository';
import { MultimediaModule } from '@/multimedia/multimedia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      TaskCategory,
      Treatment,
      Task,
      TreatmentTasks,
    ]),
    NotificationModule,
    UserModule,
    MultimediaModule,
    GamificationModule,
  ],
  providers: [
    CategoryService,
    TreatmentService,
    TaskService,
    TreatmentTaskService,
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryTypeOrmPostgres,
    },
    {
      provide: TreatmentRepository,
      useClass: TreatmentRepositoryTypeOrmPostgres,
    },
    {
      provide: TaskRespository,
      useClass: TaskRepositoryTypeOrmPostgres,
    },
    {
      provide: TreatmentTaskRepository,
      useClass: TreatmentTaskRepositoryTypeOrmPostgres,
    },
  ],
  controllers: [
    CategoryController,
    TreatmentController,
    TaskController,
    TreatmentTaskController,
  ],
})
export class ActivityModule {}
