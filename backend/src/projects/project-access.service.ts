import {
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { InjectRepository } from '@nestjs/typeorm';
  
  import { Repository } from 'typeorm';
  
  import { Project } from './project.entity';
  
  import { ProjectMember } from './project-member.entity';
  
  export type ProjectRole =
    | 'owner'
    | 'editor'
    | 'viewer';
  
  export type ProjectPermission =
    | 'view'
    | 'edit'
    | 'generate'
    | 'delete';
  
  @Injectable()
  export class ProjectAccessService {
    constructor(
      @InjectRepository(Project)
      private readonly projectRepository: Repository<Project>,
  
      @InjectRepository(ProjectMember)
      private readonly projectMemberRepository: Repository<ProjectMember>,
    ) {}
  
    async getRole(
      projectId: number,
      userId: number,
    ): Promise<ProjectRole> {
      const project =
        await this.projectRepository.findOneBy({
          id: projectId,
        });
  
      if (!project) {
        throw new NotFoundException(
          'Project not found',
        );
      }
  
      // The person who created the project is
      // always the owner.
      if (project.createdById === userId) {
        return 'owner';
      }
  
      // Otherwise, check whether the user was
      // added as a project member.
      const membership =
        await this.projectMemberRepository.findOne({
          where: {
            projectId,
            userId,
          },
        });
  
      if (!membership) {
        throw new ForbiddenException(
          'You do not have access to this project',
        );
      }
  
      return membership.role;
    }
  
    async canAccess(
      projectId: number,
      userId: number,
      permission: ProjectPermission,
    ) {
      const role = await this.getRole(
        projectId,
        userId,
      );
  
      // Owner can do everything.
      if (role === 'owner') {
        return true;
      }
  
      // Editor and viewer can currently only
      // view the project.
      if (
        permission === 'view' &&
        (role === 'editor' || role === 'viewer')
      ) {
        return true;
      }
  
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }
  }