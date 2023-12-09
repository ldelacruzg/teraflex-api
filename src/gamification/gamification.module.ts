import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, Patient } from '@/entities';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Patient, User])],
  controllers: [],
  providers: [],
})
export class GamificationModule {}
