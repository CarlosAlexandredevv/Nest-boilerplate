import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import type { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import type { JwtUser, RequestWithUser } from '../models/user';
import { canAccessTenant } from '../modules/auth/tenant-access';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = JwtUser>(
    err: Error | null,
    user: JwtUser | false,
    _info: unknown,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    if (
      !request.tenant ||
      !canAccessTenant(
        { isSuperAdmin: user.isSuperAdmin, tenantId: user.tenantId },
        request.tenant.id,
      )
    ) {
      throw new UnauthorizedException();
    }

    return user as TUser;
  }
}
