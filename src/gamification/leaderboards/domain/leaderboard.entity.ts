import { PatientLeaderboard } from '@/entities';
import { FormatDateService } from '@/shared/services/format-date.service';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Rank } from './rank.enum';

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
    this.startDate = new Date(FormatDateService.getLastMonday());
    this.endDate = new Date(FormatDateService.getNextSunday());
  }
}
