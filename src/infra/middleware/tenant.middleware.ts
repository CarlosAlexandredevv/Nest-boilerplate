import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TenantRepository } from '../repositories/tenant.repository';
import type { RequestWithUser } from '../../models/user';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const slug = req.header('x-subdomain')?.trim();
    if (!slug) {
      throw new BadRequestException('X-Subdomain is required');
    }

    const request = req as RequestWithUser;
    request.tenantSlug = slug;

    const path = req.originalUrl.split('?')[0];
    const isRegister = req.method === 'POST' && path.endsWith('/auth/register');
    if (isRegister) {
      return next();
    }

    const tenant = await this.tenantRepository.findBySlug(slug);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    request.tenant = {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
    };
    next();
  }
}
