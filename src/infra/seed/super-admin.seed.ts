import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { TenantRepository } from '../repositories/tenant.repository';

@Injectable()
export class SuperAdminSeed implements OnModuleInit {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.config.get<string>(
      'SUPER_ADMIN_EMAIL',
      'admin@localhost',
    );
    const password = this.config.get<string>(
      'SUPER_ADMIN_PASSWORD',
      'changeme123',
    );

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      if (!existing.isSuperAdmin) {
        existing.isSuperAdmin = true;
        await this.userRepository.save(existing);
      }
    } else {
      await this.userRepository.create({
        name: 'Super Admin',
        email,
        password: await bcrypt.hash(password, 10),
        isSuperAdmin: true,
      });
    }

    if (await this.tenantRepository.findBySlug('platform')) {
      return;
    }

    await this.tenantRepository.create({
      name: 'Platform',
      slug: 'platform',
    });
  }
}
