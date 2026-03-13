import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../infra/entities/user.entity';

export const typeOrmConfigFactory = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.getOrThrow<string>('DATABASE_URL'),
  autoLoadEntities: true,
  synchronize: true,
});

export const entities = [User];
