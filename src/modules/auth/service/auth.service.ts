import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/infra/repositories/user.repository';
import { RegisterUserDto } from '../dto/register-user.dto';
import bcrypt from 'bcryptjs';
import { LoginDto } from '../dto/login.dto';
import { AuthResponse, JwtPayload, User } from 'src/models/user';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterUserDto) {
    const userExists = await this.userRepository.findByEmail(registerDto.email);

    if (userExists) {
      throw new BadRequestException('Invalid credentials');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    registerDto.password = hashedPassword;

    const user = await this.userRepository.create(registerDto);
    await this.userRepository.save(user);

    return {
      message: 'User registered successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.buildAuthResponse(user);
  }
  private buildAuthResponse(user: User): AuthResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
