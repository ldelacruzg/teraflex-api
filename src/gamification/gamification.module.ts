import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Patient, Treatment } from '@/entities';
import { SharedModule } from '@/shared/shared.module';
import {
  PatientController,
  PatientService,
  PatientRepository,
  PatientRepositoryTypeOrmPostgres,
} from './patients';
import {
  TreatmentController,
  TreatmentRepository,
  TreatmentRepositoryTypeOrmPostgres,
  TreatmentService,
} from './treatments';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User, Patient, Treatment])],
  controllers: [PatientController, TreatmentController],
  providers: [
    PatientService,
    {
      provide: PatientRepository,
      useClass: PatientRepositoryTypeOrmPostgres,
    },
    TreatmentService,
    {
      provide: TreatmentRepository,
      useClass: TreatmentRepositoryTypeOrmPostgres,
    },
  ],
  exports: [PatientRepository],
})
export class GamificationModule {}
