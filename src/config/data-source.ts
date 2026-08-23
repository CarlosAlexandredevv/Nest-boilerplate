import { DataSource } from 'typeorm';
import { User } from '../infra/entities/user.entity';
import { Tenant } from '../infra/entities/tenant.entity';
import { Membership } from '../infra/entities/membership.entity';
import { env } from './env';

export default new DataSource({
  type: 'postgres',
  url: env.databaseUrl,
  entities: [User, Tenant, Membership],
  migrations: ['src/infra/migration/*.ts'],
  synchronize: false,
});
