import {
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  
  import { ThrottlerGuard } from '@nestjs/throttler';
  
  @Injectable()
  export class UserThrottlerGuard extends ThrottlerGuard {
    protected async getTracker(
      req: Record<string, any>,
    ): Promise<string> {
      return `user:${req.user.sub}`;
    }
  
    protected generateKey(
      context: ExecutionContext,
      tracker: string,
      throttlerName: string,
    ): string {
      return `user-throttle:${tracker}:${throttlerName}`;
    }
  
    protected async handleRequest(
      requestProps: any,
    ): Promise<boolean> {
      const request =
        requestProps.context
          .switchToHttp()
          .getRequest();
  
      // Only throttle authenticated users.
      if (!request.user?.sub) {
        return true;
      }
  
      // Only use the "user" throttler.
      if (requestProps.throttler.name !== 'user') {
        return true;
      }
  
      return super.handleRequest(requestProps);
    }
  }