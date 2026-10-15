import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UseGuards,
  } from '@nestjs/common';
  
  import { PublicSharingService } from './public-sharing.service';
  
  import { Public } from '../auth/public.decorator';
  
  import { ProjectAccess } from '../projects/project-access.decorator';
  import { ProjectAccessGuard } from '../projects/project-access.guard';
  
  @Controller()
  export class PublicSharingController {
    constructor(
      private readonly publicSharingService: PublicSharingService,
    ) {}
  
    @ProjectAccess('edit')
    @UseGuards(ProjectAccessGuard)
    @Post('projects/:projectId/public-share')
    enablePublicSharing(
      @Param('projectId') projectId: string,
    ) {
      return this.publicSharingService.enablePublicSharing(
        Number(projectId),
      );
    }
  
    @ProjectAccess('edit')
    @UseGuards(ProjectAccessGuard)
    @Get('projects/:projectId/public-share')
    getPublicShare(
      @Param('projectId') projectId: string,
    ) {
      return this.publicSharingService.getPublicShare(
        Number(projectId),
      );
    }
  
    @ProjectAccess('edit')
    @UseGuards(ProjectAccessGuard)
    @Delete('projects/:projectId/public-share')
    disablePublicSharing(
      @Param('projectId') projectId: string,
    ) {
      return this.publicSharingService.disablePublicSharing(
        Number(projectId),
      );
    }
  
    @Public()
    @Get('public/projects/:token')
    getPublicProject(
      @Param('token') token: string,
    ) {
      return this.publicSharingService.getPublicProject(token);
    }
  }