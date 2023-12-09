import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import {
  Assignment,
  UserValidation,
  Task,
  Category,
  Link,
  TaskCategory,
  TaskMultimedia,
  Group,
  Notification,
  NotificationToken,
  Patient,
  Treatment,
} from '@/entities';
import { RoleEnum } from '@security/jwt-strategy/role.enum';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'character varying', length: 100, name: 'first_name' })
  firstName: string;

  @Column({ type: 'character varying', length: 100, name: 'last_name' })
  lastName: string;

  @Column({
    type: 'character varying',
    length: 13,
    name: 'doc_number',
    unique: true,
  })
  docNumber: string;

  @Column({ type: 'character varying', length: 100, select: false })
  password: string;

  @Column({ type: 'character varying', length: 10, nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true, name: 'birth_date' })
  birthDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  updatedAt: Date;

  @Column({ name: 'role', type: 'character varying', length: 25 })
  role: RoleEnum;

  @Column({ name: 'first_time', type: 'boolean', nullable: true })
  firstTime: boolean;

  @Column({ name: 'category_id', type: 'bigint', nullable: true })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.therapists)
  @JoinColumn({ name: 'category_id' })
  category: Relation<Category>;

  @OneToMany(() => UserValidation, (userValidation) => userValidation.user)
  userValidations: Relation<UserValidation[]>;

  @OneToMany(() => Assignment, (assignment) => assignment.user)
  assignments: Relation<Assignment[]>;

  @OneToMany(() => Assignment, (assignment) => assignment.createdBy)
  assignmentsCreated: Relation<Assignment[]>;

  @OneToMany(() => Assignment, (assignment) => assignment.updatedBy)
  assignmentsUpdated: Relation<Assignment[]>;

  @OneToMany(() => Task, (task) => task.createdBy)
  tasksCreated: Relation<Task[]>;

  @OneToMany(() => Task, (task) => task.updatedBy)
  tasksUpdated: Relation<Task[]>;

  @OneToMany(() => Category, (category) => category.createdBy)
  categoriesCreated: Relation<Category[]>;

  @OneToMany(() => Category, (category) => category.updatedBy)
  categoriesUpdated: Relation<Category[]>;

  @OneToMany(() => Link, (link) => link.createdBy)
  linksCreated: Relation<Link[]>;

  @OneToMany(() => Link, (link) => link.updatedBy)
  linksUpdated: Relation<Link[]>;

  @OneToMany(() => TaskCategory, (taskCategory) => taskCategory.createdBy)
  tasksCategoriesCreated: Relation<TaskCategory[]>;

  @OneToMany(() => TaskCategory, (taskCategory) => taskCategory.updatedBy)
  tasksCategoriesUpdated: Relation<TaskCategory[]>;

  @OneToMany(() => TaskMultimedia, (taskMultimedia) => taskMultimedia.createdBy)
  tasksMultimediaCreated: Relation<TaskMultimedia[]>;

  @OneToMany(() => TaskMultimedia, (taskMultimedia) => taskMultimedia.updatedBy)
  tasksMultimediaUpdated: Relation<TaskMultimedia[]>;

  @OneToMany(() => Group, (group) => group.therapist)
  groupTherapist: Relation<Group[]>;

  @OneToMany(() => Group, (group) => group.patient)
  groupPatient: Relation<Group[]>;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Relation<Notification[]>;

  @OneToMany(
    () => NotificationToken,
    (notificationToken) => notificationToken.user,
  )
  notificationTokens: Relation<NotificationToken[]>;

  @OneToOne(() => Patient, (patient) => patient.user)
  patient: Relation<Patient>;

  @OneToMany(() => Treatment, (treatment) => treatment.therapist)
  treatments: Relation<Treatment[]>;
}
