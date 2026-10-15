import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  
  import { Reflector } from '@nestjs/core';
  
  import {
    ProjectAccessService,
    ProjectPermission,
  } from './project-access.service';
  
  import {
    PROJECT_PERMISSION_KEY,
  } from './project-access.constants';
  
  @Injectable()
  export class ProjectAccessGuard
    implements CanActivate
  {
    constructor(
      private readonly reflector: Reflector,
  
      private readonly projectAccessService: ProjectAccessService,
    ) {}
  
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
      const permission =
        this.reflector.getAllAndOverride<ProjectPermission>(
          PROJECT_PERMISSION_KEY,
          [
            context.getHandler(),
            context.getClass(),
          ],
        );
  
      if (!permission) {
        return true;
      }
  
      const request =
        context.switchToHttp().getRequest();
  
      const userId = request.user?.sub;
  
      if (!userId) {
        return false;
      }
  
      const projectId =
        request.params.projectId ??
        request.params.id;
  
      if (!projectId) {
        return false;
      }
  
      await this.projectAccessService.canAccess(
        Number(projectId),
        Number(userId),
        permission,
      );
  
      return true;
    }
  }