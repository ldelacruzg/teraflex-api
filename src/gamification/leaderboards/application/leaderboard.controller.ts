import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LeaderboardService } from '../infrastructure/leaderboard.service';
import { ResponseDataInterface } from '@/shared/interfaces/response-data.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ResponseHttpInterceptor } from '@/shared/interceptors/response-http.interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/security/jwt-strategy/jwt-auth.guard';
import { RoleGuard } from '@/security/jwt-strategy/roles.guard';
import { Role } from '@/security/jwt-strategy/roles.decorator';
import { RoleEnum } from '@/security/jwt-strategy/role.enum';

@Controller('leaderboards')
@UseInterceptors(ResponseHttpInterceptor, CacheInterceptor)
@ApiTags('Leaderboards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class LeaderboardController {
  constructor(private readonly service: LeaderboardService) {}

  @Get('/current')
  @ApiOperation({ summary: 'Get current week leaderboard' })
  @Role(RoleEnum.THERAPIST, RoleEnum.PATIENT)
  async getALeaderboard(
    @Query('patientId', ParseIntPipe) patientId: number,
  ): Promise<ResponseDataInterface> {
    const leaderboard = await this.service.getCurrentWeekLeaderboardByPatient(
      patientId,
    );

    return {
      message: 'Tabla de clasificación obtenida',
      data: leaderboard,
    };
  }
}
