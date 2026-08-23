import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../infra/entities/user.entity';
import { Tenant } from '../infra/entities/tenant.entity';
import { Membership } from '../infra/entities/membership.entity';

export const typeOrmConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.getOrThrow<string>('DATABASE_URL'),
  autoLoadEntities: true,
  synchronize: false,
});

export const entities = [User, Tenant, Membership];
