import { Logger, Module } from '@nestjs/common';
import { PrismaModule } from './providers/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
  ],
  controllers: [],
  providers: [
    { provide: Logger, useValue: new Logger('AppModule', { timestamp: true }) },
  ],
})
export class AppModule {}
