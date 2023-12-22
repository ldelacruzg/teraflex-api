import { Controller } from '@nestjs/common';
import { LeaderboardService } from '../infrastructure/leaderboard.service';

@Controller('leaderboards')
export class LeaderboardController {
  constructor(private readonly service: LeaderboardService) {}
}
