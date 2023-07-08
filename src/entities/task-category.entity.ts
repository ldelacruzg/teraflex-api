import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Task } from './task.entity';
import { User } from './user.entity';

@Entity('task_category')
export class TaskCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true, type: 'boolean' })
  status: boolean;

  @Column({ name: 'created_by', type: 'bigint' })
  createdById: number;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedById: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ name: 'task_id', type: 'bigint' })
  taskId: number;

  @Column({ name: 'category_id', type: 'bigint' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.tasksCategories)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Task, (task) => task.tasksCategories)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @ManyToOne(() => User, (user) => user.tasksCategoriesCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.tasksCategoriesUpdated)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;
}
