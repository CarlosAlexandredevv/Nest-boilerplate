import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Membership } from '../entities/membership.entity';
import { MembershipRole } from '../../models/user';

@Injectable()
export class MembershipRepository {
  constructor(
    @InjectRepository(Membership)
    private readonly membershipRepository: Repository<Membership>,
  ) {}

  private repo(em?: EntityManager): Repository<Membership> {
    return em?.getRepository(Membership) ?? this.membershipRepository;
  }

  findByUserAndTenant(
    userId: string,
    tenantId: string,
    em?: EntityManager,
  ): Promise<Membership | null> {
    return this.repo(em).findOne({ where: { userId, tenantId } });
  }

  create(
    input: {
      userId: string;
      tenantId: string;
      role: MembershipRole;
    },
    em?: EntityManager,
  ): Promise<Membership> {
    const repo = this.repo(em);
    return repo.save(repo.create(input));
  }
}
