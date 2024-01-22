import { PatientLeaderboard } from '@/entities';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Rank } from './rank.enum';
import { FormatDateService } from '@/shared/services/format-date.service';

@Entity({ name: 'leaderboard' })
export class Leaderboard {
  // Fields
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ type: 'enum', enum: Rank })
  rank: Rank;

  // Relations
  @OneToMany(
    () => PatientLeaderboard,
    (patientLeaderboard) => patientLeaderboard.leaderboard,
  )
  patientLeaderboards: Relation<PatientLeaderboard[]>;

  // Hooks
  @BeforeInsert()
  initialize() {
    this.startDate = FormatDateService.getLastMonday();
    this.endDate = FormatDateService.getNextSunday();
  }
}
