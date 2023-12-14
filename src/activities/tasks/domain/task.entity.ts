import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../entities/user.entity';
import { TaskCategory } from '../../../entities/task-category.entity';
import { TaskMultimedia } from '../../../entities/task-multimedia.entity';

@Entity('task')
export class Task {
  // Fields
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, type: 'character varying' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'is_public', type: 'boolean', default: false })
  isPublic: boolean;

  // Fields for audit
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

  // Relations
  @ManyToOne(() => User, (user) => user.tasksCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: Relation<User>;

  @ManyToOne(() => User, (user) => user.tasksUpdated)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: Relation<User>;

  @OneToMany(() => TaskCategory, (taskCategory) => taskCategory.task)
  tasksCategories: Relation<TaskCategory[]>;

  @OneToMany(() => TaskMultimedia, (taskMultimedia) => taskMultimedia.task)
  tasksMultimedia: Relation<TaskMultimedia[]>;
}
