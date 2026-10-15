import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { WorkflowsService } from './workflows.service';

import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectAccess } from '../projects/project-access.decorator';
import { ProjectAccessGuard } from '../projects/project-access.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Workflows')
@Controller('projects/:projectId/workflows')
@UseGuards(JwtAuthGuard)
export class WorkflowsController {
  constructor(
    private readonly workflowsService: WorkflowsService,
  ) {}

  @ProjectAccess('edit')
  @UseGuards(ProjectAccessGuard)
  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateWorkflowDto,
    @Req() request: any,
  ) {
    return this.workflowsService.create(
      Number(projectId),
      dto,
      request.user.sub,
    );
  }

  @ProjectAccess('generate')
  @UseGuards(ProjectAccessGuard)
  @Post('structure/generate')
  generateStructure(
    @Param('projectId') projectId: string,
    @Req() request: any,
  ) {
    return this.workflowsService.generateStructure(
      Number(projectId),
      request.user.sub,
    );
  }

  @ProjectAccess('view')
  @UseGuards(ProjectAccessGuard)
  @Get('structure')
  findStructure(
    @Param('projectId') projectId: string,
    @Req() request: any,
  ) {
    return this.workflowsService.findStructure(
      Number(projectId),
      request.user.sub,
    );
  }

  @ProjectAccess('generate')
  @UseGuards(ProjectAccessGuard)
  @Post('actors/:actorId/generate')
  generateActorWorkflows(
    @Param('projectId') projectId: string,
    @Param('actorId') actorId: string,
    @Req() request: any,
  ) {
    return this.workflowsService.generateActorWorkflows(
      Number(projectId),
      Number(actorId),
      request.user.sub,
    );
  }

  @ProjectAccess('view')
  @UseGuards(ProjectAccessGuard)
  @Get('public-flow')
  findPublicFlow(
    @Param('projectId') projectId: string,
    @Req() request: any,
  ) {
    return this.workflowsService.findPublicFlow(
      Number(projectId),
      request.user.sub,
    );
  }

  @ProjectAccess('view')
  @UseGuards(ProjectAccessGuard)
  @Get()
  findAll(
    @Param('projectId') projectId: string,
    @Req() request: any,
  ) {
    return this.workflowsService.findAll(
      Number(projectId),
      request.user.sub,
    );
  }

  @Get(':workflowId')
  findOne(
    @Param('workflowId') workflowId: string,
    @Req() request: any,
  ) {
    return this.workflowsService.findOne(
      Number(workflowId),
      request.user.sub,
    );
  }

  @Patch(':workflowId')
  update(
    @Param('workflowId') workflowId: string,
    @Body() dto: UpdateWorkflowDto,
    @Req() request: any,
  ) {
    return this.workflowsService.update(
      Number(workflowId),
      dto,
      request.user.sub,
    );
  }

  @Delete(':workflowId')
  remove(
    @Param('workflowId') workflowId: string,
    @Req() request: any,
  ) {
    return this.workflowsService.remove(
      Number(workflowId),
      request.user.sub,
    );
  }
}