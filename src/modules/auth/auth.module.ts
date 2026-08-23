import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserRepository } from 'src/infra/repositories/user.repository';
import { TenantRepository } from 'src/infra/repositories/tenant.repository';
import { MembershipRepository } from 'src/infra/repositories/membership.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt-strategy';
import { SuperAdminSeed } from 'src/infra/seed/super-admin.seed';
import { resolveEnv } from 'src/config/env';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: resolveEnv(
          config.get<string>('JWT_SECRET'),
          config.get<string>('CORS_ORIGIN'),
          config.get<string>('NODE_ENV'),
        ).jwtSecret,
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
    SuperAdminSeed,
  ],
  exports: [TenantRepository],
})
export class AuthModule {}
