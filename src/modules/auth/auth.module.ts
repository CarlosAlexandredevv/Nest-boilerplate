import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: (() => {
        const expiresInEnv = process.env.JWT_EXPIRATION_TIME;
        if (!expiresInEnv) {
          return undefined;
        }

        const asNumber = Number(expiresInEnv);
        const expiresIn: SignOptions['expiresIn'] = Number.isNaN(asNumber)
          ? (expiresInEnv as SignOptions['expiresIn'])
          : asNumber;

        return { expiresIn };
      })(),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
