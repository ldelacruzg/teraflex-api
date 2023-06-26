import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50, type: 'character varying' })
  name: string;

  @Column({ nullable: true, default: null, type: 'text' })
  description: string;

  @Column({ default: true, type: 'boolean' })
  status: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdById: number;

  @Column({ name: 'updated_by', nullable: true })
  updatedById: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToOne(() => User, (user) => user.rolesCreated)
  createdBy: User;

  @ManyToOne(() => User, (user) => user.rolesUpdated)
  updatedBy: User;
}
