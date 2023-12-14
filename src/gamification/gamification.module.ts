import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Patient } from '@/entities';
import { SharedModule } from '@/shared/shared.module';
import {
  PatientController,
  PatientService,
  PatientRepository,
  PatientRepositoryTypeOrmPostgres,
} from './patients';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User, Patient])],
  controllers: [PatientController],
  providers: [
    PatientService,
    {
      provide: PatientRepository,
      useClass: PatientRepositoryTypeOrmPostgres,
    },
  ],
  exports: [PatientRepository],
})
export class GamificationModule {}
