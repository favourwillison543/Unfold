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

import { ProjectsService } from './projects.service';

import { CreateProjectDto } from './dto/create-project.dto';

import { UpdateProjectDto } from './dto/update-project.dto';

import { GenerateGoalsDto } from './dto/generate-goals.dto';

import { ProjectAccess } from './project-access.decorator';

import { ProjectAccessGuard } from './project-access.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
  ) {}

  @Get()
  getProjects(@Req() request: any) {
    const userId = request.user.sub;

    return this.projectsService.getProjects(userId);
  }

  @ProjectAccess('view')
  @UseGuards(ProjectAccessGuard)
  @Get(':id')
  getProject(
    @Param('id') id: string,
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.getProject(
      Number(id),
      userId,
    );
  }

  @Post()
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.createProject(
      createProjectDto,
      userId,
    );
  }

  @ProjectAccess('edit')
  @UseGuards(ProjectAccessGuard)
  @Post(':projectId/analysis')
  createAnalysis(
    @Param('projectId') projectId: string,
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.createAnalysis(
      Number(projectId),
      userId,
    );
  }

  @ProjectAccess('edit')
  @UseGuards(ProjectAccessGuard)
  @Patch(':id')
  updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.updateProject(
      Number(id),
      updateProjectDto,
      userId,
    );
  }

  @ProjectAccess('delete')
  @UseGuards(ProjectAccessGuard)
  @Delete(':id')
  deleteProject(
    @Param('id') id: string,
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.deleteProject(
      Number(id),
      userId,
    );
  }

  @ProjectAccess('view')
  @UseGuards(ProjectAccessGuard)
  @Get(':projectId/analysis')
  getAnalysis(
    @Param('projectId') projectId: string,
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.getAnalysis(
      Number(projectId),
      userId,
    );
  }

  @ProjectAccess('view')
  @UseGuards(ProjectAccessGuard)
  @Get(':projectId/questions')
  getQuestions(
    @Param('projectId') projectId: string,
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.getQuestions(
      Number(projectId),
      userId,
    );
  }

  @ProjectAccess('edit')
  @UseGuards(ProjectAccessGuard)
  @Patch(':projectId/questions')
  updateQuestions(
    @Param('projectId') projectId: string,
    @Body() questions: any[],
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.updateQuestions(
      Number(projectId),
      questions,
      userId,
    );
  }

  @ProjectAccess('view')
  @UseGuards(ProjectAccessGuard)
  @Get(':projectId/goals')
  getGoals(
    @Param('projectId') projectId: string,
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.getGoals(
      Number(projectId),
      userId,
    );
  }

  @ProjectAccess('edit')
  @UseGuards(ProjectAccessGuard)
  @Patch(':projectId/goals')
  updateGoals(
    @Param('projectId') projectId: string,
    @Body() goals: any[],
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.updateGoals(
      Number(projectId),
      goals,
      userId,
    );
  }

  @ProjectAccess('generate')
  @UseGuards(ProjectAccessGuard)
  @Post(':projectId/questions')
  generateQuestions(
    @Param('projectId') projectId: string,
    @Req() request: any,
  ) {
    return this.projectsService.generateQuestions(
      Number(projectId),
      request.user.sub,
    );
  }

  @ProjectAccess('generate')
  @UseGuards(ProjectAccessGuard)
  @Post(':projectId/goals/suggestions')
  generateGoalSuggestions(
    @Param('projectId') projectId: string,
    @Body() generateGoalsDto: GenerateGoalsDto,
    @Req() request: any,
  ) {
    const userId = request.user.sub;

    return this.projectsService.generateGoalSuggestions(
      Number(projectId),
      generateGoalsDto,
      userId,
    );
  }
}