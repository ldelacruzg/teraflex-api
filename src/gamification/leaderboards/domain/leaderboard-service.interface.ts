import { Resource } from '@/shared/interfaces/resource.interface';
import { Leaderboard } from './leaderboard.entity';
import { CreateLeaderboardDto } from './dtos/create-learderboard.dto';

export interface ILeaderboardService
  extends Resource<Leaderboard, CreateLeaderboardDto> {}
