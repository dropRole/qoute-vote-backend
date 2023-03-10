import { Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      ctx.getClass(),
      ctx.getHandler(),
    ]);

    const {
      headers: { authorization },
    } = ctx.switchToHttp().getRequest();

    // if route is public and no Auth provided
    if (isPublic && !authorization) return true;

    return super.canActivate(ctx);
  }
}
