import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './typeorm.config';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
