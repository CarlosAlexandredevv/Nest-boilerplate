import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserRepository } from 'src/infra/repositories/user.repository';
import { TenantRepository } from 'src/infra/repositories/tenant.repository';
import { MembershipRepository } from 'src/infra/repositories/membership.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';
import { TenantMiddleware } from 'src/infra/middleware/tenant.middleware';
import { SuperAdminSeed } from 'src/infra/seed/super-admin.seed';
import { resolveJwtSecret } from 'src/config/env';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: resolveJwtSecret(
          config.get<string>('JWT_SECRET'),
          config.get<string>('NODE_ENV'),
        ),
        signOptions: {
          expiresIn: config.get<string>(
            'JWT_EXPIRES_IN',
            '7d',
          ) as `${number}${'s' | 'm' | 'h' | 'd'}`,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    TenantRepository,
    MembershipRepository,
    JwtStrategy,
    TenantMiddleware,
    SuperAdminSeed,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(AuthController);
  }
}
