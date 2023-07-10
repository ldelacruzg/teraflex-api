import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskCategory } from './task-category.entity';
import { User } from './user.entity';

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'character varying', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'created_by', type: 'bigint' })
  createdById: number;

  @Column({ name: 'updated_by', type: 'bigint', nullable: true })
  updatedById: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @OneToMany(() => TaskCategory, (taskCategory) => taskCategory.category)
  tasksCategories: TaskCategory[];

  @ManyToOne(() => User, (user) => user.categoriesCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.categoriesUpdated)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: User;

  @OneToMany(() => User, (user) => user.category)
  therapists: User[];
}
