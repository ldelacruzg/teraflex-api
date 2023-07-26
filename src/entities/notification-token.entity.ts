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
import { User } from '@entities/user.entity';

@Entity('notification_token')
export class NotificationToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'token', type: 'varchar', length: 255 })
  token: string;

  @Column({ name: 'device', type: 'varchar', length: 255, unique: true })
  device: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updated_at: Date;

  @Column({ name: 'status', type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => User, (user) => user.notificationTokens)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;
}
