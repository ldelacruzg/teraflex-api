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
import { Exclude } from 'class-transformer';
import { UserValidation } from './user-validation.entity';
import { Assignment } from './assignment.entity';
import { Task } from './task.entity';
import { Category } from './category.entity';
import { Link } from './link.entity';
import { TaskCategory } from './task-category.entity';
import { TaskMultimedia } from './task-multimedia.entity';
import { RoleEnum } from 'src/security/jwt-strategy/role.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'character varying', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'character varying', length: 100, name: 'last_name' })
  lastName: string;

  @Column({ type: 'character varying', length: 13, name: 'doc_number' })
  docNumber: string;

  @Column({ type: 'character varying', length: 100 })
  @Exclude()
  password: string;

  @Column({ type: 'character varying', length: 10, nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @Column({ name: 'role', type: 'character varying', length: 25 })
  role: RoleEnum;

  @OneToMany(() => UserValidation, (userValidation) => userValidation.user)
  userValidations: UserValidation[];

  @OneToMany(() => Assignment, (assignment) => assignment.user)
  assignments: Assignment[];

  @OneToMany(() => Assignment, (assignment) => assignment.createdBy)
  assignmentsCreated: Assignment[];

  @OneToMany(() => Assignment, (assignment) => assignment.updatedBy)
  assignmentsUpdated: Assignment[];

  @OneToMany(() => Task, (task) => task.createdBy)
  tasksCreated: Task[];

  @OneToMany(() => Task, (task) => task.updatedBy)
  tasksUpdated: Task[];

  @OneToMany(() => Category, (category) => category.createdBy)
  categoriesCreated: Category[];

  @OneToMany(() => Category, (category) => category.updatedBy)
  categoriesUpdated: Category[];

  @OneToMany(() => Link, (link) => link.createdBy)
  linksCreated: Link[];

  @OneToMany(() => Link, (link) => link.updatedBy)
  linksUpdated: Link[];

  @OneToMany(() => TaskCategory, (taskCategory) => taskCategory.createdBy)
  tasksCategoriesCreated: TaskCategory[];

  @OneToMany(() => TaskCategory, (taskCategory) => taskCategory.updatedBy)
  tasksCategoriesUpdated: TaskCategory[];

  @OneToMany(() => TaskMultimedia, (taskMultimedia) => taskMultimedia.createdBy)
  tasksMultimediaCreated: TaskMultimedia[];

  @OneToMany(() => TaskMultimedia, (taskMultimedia) => taskMultimedia.updatedBy)
  tasksMultimediaUpdated: TaskMultimedia[];
}
