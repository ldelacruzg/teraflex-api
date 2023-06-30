import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from 'src/entities/assignment.entity';
import { Category } from 'src/entities/category.entity';
import { TaskCategory } from 'src/entities/task-category.entity';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { CategoryService } from './services/category/category.service';
import { CategoryController } from './controllers/category/category.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Category, Assignment, TaskCategory, User]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class ActivityModule {}
