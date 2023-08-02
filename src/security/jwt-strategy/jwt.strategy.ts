import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Environment } from '@shared/constants/environment';
import { InfoUserInterface } from '@security/jwt-strategy/info-user.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Environment.JWT_SECRETKEY,
    });
  }
  async validate(payload: InfoUserInterface) {
    return { id: payload.id, docNumber: payload.docNumber, role: payload.role };
  }
}
