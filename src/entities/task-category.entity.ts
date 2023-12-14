import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { Category, Task, User } from '@/entities';

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  @Column({ name: 'task_id', type: 'bigint' })
  taskId: number;

  @Column({ name: 'category_id', type: 'bigint' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.tasksCategories)
  @JoinColumn({ name: 'category_id' })
  category: Relation<Category>;

  @ManyToOne(() => Task, (task) => task.tasksCategories)
  @JoinColumn({ name: 'task_id' })
  task: Relation<Task>;

  @ManyToOne(() => User, (user) => user.tasksCategoriesCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: Relation<User>;

  @ManyToOne(() => User, (user) => user.tasksCategoriesUpdated)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: Relation<User>;
}
