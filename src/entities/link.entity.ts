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
import { TaskMultimedia } from './task-multimedia.entity';
import { User } from './user.entity';

@Entity('link')
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'character varying' })
  url: string;

  @Column({ type: 'character varying', length: 100 })
  title: string;

  @Column({ type: 'character varying', nullable: true })
  description: string;

  @Column({ type: 'character varying', nullable: true, default: false })
  isPublic: boolean;

  @Column({ type: 'boolean', default: true })
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

  @Column({ type: 'character varying', name: 'type', length: 20 })
  type: string;

  @OneToMany(() => TaskMultimedia, (taskMultimedia) => taskMultimedia.link)
  tasksMultimedia: Relation<TaskMultimedia[]>;

  @ManyToOne(() => User, (user) => user.linksCreated)
  @JoinColumn({ name: 'created_by' })
  createdBy: Relation<User>;

  @ManyToOne(() => User, (user) => user.linksUpdated)
  @JoinColumn({ name: 'updated_by' })
  updatedBy: Relation<User>;
}
