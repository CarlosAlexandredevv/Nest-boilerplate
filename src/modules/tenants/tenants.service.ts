import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantRepository } from '../../infra/repositories/tenant.repository';
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly tenantRepository: TenantRepository) {}

  findAll() {
    return this.tenantRepository.findAll();
  }

  async findOne(id: string) {
    const tenant = await this.tenantRepository.findById(id);
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  create(dto: CreateTenantDto) {
    return this.tenantRepository.create(dto);
  }

  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await this.findOne(id);
    Object.assign(tenant, dto);
    return this.tenantRepository.save(tenant);
  }

  async remove(id: string) {
    const tenant = await this.findOne(id);
    await this.tenantRepository.remove(tenant);
  }
}
