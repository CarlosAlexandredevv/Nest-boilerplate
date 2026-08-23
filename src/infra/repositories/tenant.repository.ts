import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class TenantRepository {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
  ) {}

  findBySlug(slug: string): Promise<Tenant | null> {
    return this.tenants.findOne({ where: { slug } });
  }

  findById(id: string): Promise<Tenant | null> {
    return this.tenants.findOne({ where: { id } });
  }

  findAll(): Promise<Tenant[]> {
    return this.tenants.find({ order: { createdAt: 'DESC' } });
  }

  create(input: { name: string; slug: string }): Promise<Tenant> {
    return this.tenants.save(this.tenants.create(input));
  }

  save(tenant: Tenant): Promise<Tenant> {
    return this.tenants.save(tenant);
  }

  remove(tenant: Tenant): Promise<Tenant> {
    return this.tenants.remove(tenant);
  }
}
