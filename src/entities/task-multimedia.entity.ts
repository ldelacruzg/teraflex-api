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
import { Link } from './link.entity';
import { Task } from '../activities/tasks/domain/task.entity';
import { User } from './user.entity';

@Entity()
export class TaskMultimedia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'task_id', type: 'bigint' })
  taskId: number;

  @Column({ name: 'link_id', type: 'bigint' })
  linkId: number;

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

  @ManyToOne(() => Link, (link) => link.tasksMultimedia)
  @JoinColumn({ name: 'link_id' })
  link: Relation<Link>;

  @ManyToOne(() => Task, (task) => task.tasksMultimedia)
  @JoinColumn({ name: 'task_id' })
  task: Relation<Task>;

  @ManyToOne(() => User, (user) => user.tasksMultimediaCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: Relation<User>;

  @ManyToOne(() => User, (user) => user.tasksMultimediaUpdated)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: Relation<User>;
}
