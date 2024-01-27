import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatientLeaderboard, TreatmentTasks, User } from '@/entities';
import { SharedModule } from '@/shared/shared.module';
import {
  Patient,
  PatientController,
  PatientService,
  PatientRepository,
  PatientRepositoryTypeOrmPostgres,
} from './patients';

import {
  Leaderboard,
  LeaderboardController,
  LeaderboardRepository,
  LeaderboardRepositoryTypeOrmPostgres,
  LeaderboardService,
} from './leaderboards';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      User,
      Patient,
      Leaderboard,
      PatientLeaderboard,
      TreatmentTasks,
    ]),
  ],
  controllers: [PatientController, LeaderboardController],
  providers: [
    PatientService,
    LeaderboardService,
    {
      provide: PatientRepository,
      useClass: PatientRepositoryTypeOrmPostgres,
    },
    {
      provide: LeaderboardRepository,
      useClass: LeaderboardRepositoryTypeOrmPostgres,
    },
  ],
  exports: [PatientRepository, LeaderboardRepository],
})
export class GamificationModule {}
