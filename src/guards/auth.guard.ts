import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import type { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import type { JwtUser } from '../models/user';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _info: unknown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status?: unknown,
  ): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user as TUser;
  }
}
