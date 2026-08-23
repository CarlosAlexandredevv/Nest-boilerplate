import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class TenantRepository {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  private repo(em?: EntityManager): Repository<Tenant> {
    return em?.getRepository(Tenant) ?? this.tenantRepository;
  }

  findBySlug(slug: string, em?: EntityManager): Promise<Tenant | null> {
    return this.repo(em).findOne({ where: { slug } });
  }

  findById(id: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ where: { id } });
  }

  findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find({ order: { createdAt: 'DESC' } });
  }

  create(
    input: { name: string; slug: string },
    em?: EntityManager,
  ): Promise<Tenant> {
    const repo = this.repo(em);
    return repo.save(repo.create(input));
  }

  save(tenant: Tenant): Promise<Tenant> {
    return this.tenantRepository.save(tenant);
  }

  remove(tenant: Tenant): Promise<Tenant> {
    return this.tenantRepository.remove(tenant);
  }
}
