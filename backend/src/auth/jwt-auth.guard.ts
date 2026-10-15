import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { JwtService } from '@nestjs/jwt';

import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // Public routes do not require authentication.
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (isPublic) {
      return true;
    }

    // Get the incoming HTTP request.
    const request =
      context.switchToHttp().getRequest();

    // Get the JWT from the HttpOnly cookie.
    const token =
      request.cookies?.accessToken;

    // No cookie = not authenticated.
    if (!token) {
      throw new UnauthorizedException(
        'Authentication required',
      );
    }

    try {
      // Verify the JWT.
      const payload =
        await this.jwtService.verifyAsync(token);

      // Store the verified JWT payload
      // on the request for later guards/controllers.
      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired token',
      );
    }
  }
}