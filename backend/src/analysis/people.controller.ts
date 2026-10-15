import {
    Body,
    Controller,
    Param,
    Post,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  import { CreatePersonDto } from './dto/create-person.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PeopleService } from './people.service';
  
  
  @Controller('projects/:projectId/analysis')
  // @UseGuards(JwtAuthGuard)
  export class PeopleController {
    constructor(
      private readonly peopleService: PeopleService,
    ) {}
  
    @Post('people')
    createPerson(
      @Param('projectId') projectId: string,
      @Body() createPersonDto: CreatePersonDto,
      @Req() request: any,
    ) {
      const userId = request.user.sub;
  
      return this.peopleService.createPerson(
        Number(projectId),
        userId,
        createPersonDto,
      );
    }
  }