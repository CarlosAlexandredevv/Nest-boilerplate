import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/models/user';
import { resolveEnv } from 'src/config/env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    /* eslint-disable @typescript-eslint/no-unsafe-assignment */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: resolveEnv(
        config.get<string>('JWT_SECRET'),
        config.get<string>('CORS_ORIGIN'),
        config.get<string>('NODE_ENV'),
      ).jwtSecret,
    });
    /* eslint-enable @typescript-eslint/no-unsafe-assignment */
  }

  validate(payload: JwtPayload) {
    if (!payload?.sub || !payload.tenantId) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      tenantId: payload.tenantId,
      isSuperAdmin: payload.isSuperAdmin,
    };
  }
}
