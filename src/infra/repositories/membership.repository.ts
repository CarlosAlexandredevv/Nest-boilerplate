import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membership } from '../entities/membership.entity';
import { MembershipRole } from '../../models/user';

@Injectable()
export class MembershipRepository {
  constructor(
    @InjectRepository(Membership)
    private readonly memberships: Repository<Membership>,
  ) {}

  findByUserAndTenant(
    userId: string,
    tenantId: string,
  ): Promise<Membership | null> {
    return this.memberships.findOne({ where: { userId, tenantId } });
  }

  create(input: {
    userId: string;
    tenantId: string;
    role: MembershipRole;
  }): Promise<Membership> {
    return this.memberships.save(this.memberships.create(input));
  }
}
