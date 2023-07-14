import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from 'src/entities/assignment.entity';
import { Category } from 'src/entities/category.entity';
import { TaskCategory } from 'src/entities/task-category.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { CategoryService } from './services/category/category.service';
import { CategoryController } from './controllers/category/category.controller';
import { TaskService } from './services/task/task.service';
import { TaskController } from './controllers/task/task.controller';
import { AssignmentService } from './services/assignment/assignment.service';
import { AssignmentController } from './controllers/assignment/assignment.controller';
import { Link } from 'src/entities/link.entity';
import { TaskMultimedia } from 'src/entities/task-multimedia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task,
      Category,
      Assignment,
      TaskCategory,
      User,
      Link,
      TaskMultimedia,
    ]),
  ],
  providers: [CategoryService, TaskService, AssignmentService],
  controllers: [CategoryController, TaskController, AssignmentController],
})
export class ActivityModule {}
