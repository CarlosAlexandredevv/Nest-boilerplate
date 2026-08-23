import { BadRequestException, Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginDto } from '../dto/login.dto';
import type { RequestWithUser } from 'src/models/user';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.authService.register(registerDto, req.tenantSlug ?? '');
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: RequestWithUser) {
    if (!req.tenant) {
      throw new BadRequestException('X-Subdomain is required');
    }
    return this.authService.login(loginDto, req.tenant);
  }
}
