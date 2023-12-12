import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Patient } from '@/entities';
import { SharedModule } from '@/shared/shared.module';
import { PatientController } from './patients/application/patient.controller';
import { PatientService } from './patients/infrastructure/patient.service.impl';
import { PatientRepository } from './patients/domain/patient.repository';
import { PatientRepositoryTypeOrmPostgres } from './patients/infrastructure/patient.repository.typeorm.postgres';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Patient, User])],
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
