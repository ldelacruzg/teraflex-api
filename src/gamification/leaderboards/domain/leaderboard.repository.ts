import { Resource } from '@/shared/interfaces/resource.interface';
import { Leaderboard } from './leaderboard.entity';
import { CreateLeaderboardDto } from './dtos/create-learderboard.dto';

export abstract class LeaderboardRepository extends Resource<
  Leaderboard,
  CreateLeaderboardDto
> {}
