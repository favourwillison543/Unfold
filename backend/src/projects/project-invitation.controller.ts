import {
    Body,
    Controller,
    Param,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  import { ProjectInvitationService } from './project-invitation.service';
  import { ProjectAccess } from './project-access.decorator';
  import { ProjectAccessGuard } from './project-access.guard';
import { ApiTags } from '@nestjs/swagger';
  
  @ApiTags('Project Invitations')
  @Controller()
  export class ProjectInvitationController {
    constructor(
      private readonly projectInvitationService: ProjectInvitationService,
    ) {}
  
    @ProjectAccess('edit')
    @UseGuards(ProjectAccessGuard)
    @Post('projects/:projectId/invitations')
    createInvitation(
      @Param('projectId') projectId: string,
      @Body()
      body: {
        email: string;
        role: 'editor' | 'viewer';
      },
      @Req() request: any,
    ) {
      return this.projectInvitationService.createInvitation(
        Number(projectId),
        body.email,
        body.role,
        request.user.sub,
      );
    }
  
    @Post('invitations/:token/accept')
    acceptInvitation(
      @Param('token') token: string,
      @Req() request: any,
    ) {
      return this.projectInvitationService.acceptInvitation(
        token,
        request.user.sub,
        request.user.email,
      );
    }
  }