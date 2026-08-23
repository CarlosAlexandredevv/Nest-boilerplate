import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UserRepository } from 'src/infra/repositories/user.repository';
import { TenantRepository } from 'src/infra/repositories/tenant.repository';
import { MembershipRepository } from 'src/infra/repositories/membership.repository';
import { RegisterUserDto } from '../dto/register-user.dto';
import bcrypt from 'bcryptjs';
import { LoginDto } from '../dto/login.dto';
import {
  AuthResponse,
  JwtPayload,
  MembershipRole,
  TenantInfo,
  UserRole,
} from 'src/models/user';
import { User } from 'src/infra/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly membershipRepository: MembershipRepository,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async register(registerDto: RegisterUserDto, headerSlug: string) {
    if (headerSlug !== registerDto.slug) {
      throw new BadRequestException('Invalid credentials');
    }

    await this.dataSource.transaction(async (em) => {
      const slugTaken = await this.tenantRepository.findBySlug(
        registerDto.slug,
        em,
      );
      if (slugTaken) {
        throw new ConflictException('Slug already in use');
      }

      let user = await this.userRepository.findByEmail(registerDto.email, em);
      if (user) {
        const passwordOk = await bcrypt.compare(
          registerDto.password,
          user.password,
        );
        if (!passwordOk) {
          throw new BadRequestException('Invalid credentials');
        }
      } else {
        user = await this.userRepository.create(
          {
            name: registerDto.name,
            email: registerDto.email,
            password: await bcrypt.hash(registerDto.password, 10),
          },
          em,
        );
      }

      const tenant = await this.tenantRepository.create(
        { name: registerDto.tenantName, slug: registerDto.slug },
        em,
      );

      await this.membershipRepository.create(
        {
          userId: user.id,
          tenantId: tenant.id,
          role: MembershipRole.ADMIN,
        },
        em,
      );
    });

    return { message: 'User registered successfully' };
  }

  async login(loginDto: LoginDto, tenant: TenantInfo) {
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

    const membership = await this.membershipRepository.findByUserAndTenant(
      user.id,
      tenant.id,
    );

    if (user.isSuperAdmin) {
      return this.buildAuthResponse(user, tenant, UserRole.SUPER_ADMIN);
    }

    if (!membership) {
      throw new BadRequestException('Invalid credentials');
    }

    const role =
      membership.role === MembershipRole.ADMIN
        ? UserRole.ADMIN
        : UserRole.USER;

    return this.buildAuthResponse(user, tenant, role);
  }

  private buildAuthResponse(
    user: User,
    tenant: TenantInfo,
    role: UserRole,
  ): AuthResponse {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role,
      tenantId: tenant.id,
      isSuperAdmin: user.isSuperAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
      },
      tenant,
    };
  }
}
