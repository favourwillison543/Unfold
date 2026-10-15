import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ChallengesService } from './challenges.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProjectAccess } from '../projects/project-access.decorator';
import { ProjectAccessGuard } from '../projects/project-access.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Challenges')
@Controller('projects/:projectId/challenges')
@UseGuards(JwtAuthGuard)
export class ChallengesController {
  constructor(
    private readonly challengesService: ChallengesService,
  ) {}

  @ProjectAccess('generate')
  @UseGuards(ProjectAccessGuard)
  @Post('generate')
  generate(
    @Param('projectId') projectId: string,
    @Req() request: any,
  ) {
    return this.challengesService.generate(
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
    return this.challengesService.findAll(
      Number(projectId),
      request.user.sub,
    );
  }

  @Patch(':challengeId')
  update(
    @Param('challengeId') challengeId: string,
    @Body() body: { resolved?: boolean },
    @Req() request: any,
  ) {
    return this.challengesService.update(
      Number(challengeId),
      request.user.sub,
      body,
    );
  }
}