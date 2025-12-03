import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-ayth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto, @Res() res: Response) {
    try {
      const result = await this.authService.login({ loginAuthDto });

      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({
        message: result.message,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  async register(@Body() props: CreateAuthDto) {
    try {
      return await this.authService.register(props);
    } catch (error) {
      throw error;
    }
  }
}
