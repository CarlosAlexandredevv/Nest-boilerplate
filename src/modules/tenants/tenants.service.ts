import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
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

  async create(dto: CreateTenantDto) {
    try {
      return await this.tenantRepository.create(dto);
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async update(id: string, dto: UpdateTenantDto) {
    const tenant = await this.findOne(id);
    Object.assign(tenant, dto);
    try {
      return await this.tenantRepository.save(tenant);
    } catch (error) {
      this.rethrowUnique(error);
    }
  }

  async remove(id: string) {
    const tenant = await this.findOne(id);
    await this.tenantRepository.remove(tenant);
  }

  private rethrowUnique(error: unknown): never {
    if (
      error instanceof QueryFailedError &&
      (error as { driverError?: { code?: string } }).driverError?.code ===
        '23505'
    ) {
      throw new ConflictException('Slug already in use');
    }
    throw error;
  }
}
