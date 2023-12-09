import { PatientLeaderboard } from '@/entities';
import {
  BeforeInsert,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity({ name: 'leaderboard' })
export class Leaderboard {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ name: 'start_date', type: 'timestamp with time zone' })
  startDate: Date;

  @CreateDateColumn({ name: 'end_date', type: 'timestamp with time zone' })
  endDate: Date;

  @OneToMany(
    () => PatientLeaderboard,
    (patientLeaderboard) => patientLeaderboard.leaderboard,
  )
  patientLeaderboards: Relation<PatientLeaderboard[]>;

  @BeforeInsert()
  setEndDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);
    this.endDate = currentDate;
  }
}
