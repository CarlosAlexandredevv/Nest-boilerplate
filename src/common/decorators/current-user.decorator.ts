import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { RequestWithUser } from '../../models/user';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
