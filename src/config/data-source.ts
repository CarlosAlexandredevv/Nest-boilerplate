import { DataSource } from 'typeorm';
import { User } from '../infra/entities/user.entity';
import { env } from './env';

export default new DataSource({
  type: 'postgres',
  url: env.databaseUrl,
  entities: [User],
  migrations: ['src/infra/migration/*.ts'],
  synchronize: false,
});
