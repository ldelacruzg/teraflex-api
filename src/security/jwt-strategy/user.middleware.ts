import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  private InfoUserInterface: Express.User;
  use(req: Request, res: Response, next: NextFunction) {
    req['user'] = this.InfoUserInterface;
    next();
  }
}
