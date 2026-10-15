import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  
  import { Person } from './entities/person.entity';
  import { Analysis } from './entities/analysis.entity';
  import { CreatePersonDto } from './dto/create-person.dto';
  
  @Injectable()
  export class PeopleService {
    constructor(
      @InjectRepository(Person)
      private readonly personRepository: Repository<Person>,
  
      @InjectRepository(Analysis)
      private readonly analysisRepository: Repository<Analysis>,
    ) {}
  
    async createPerson(
      projectId: number,
      userId: number,
      createPersonDto: CreatePersonDto,
    ) {
      const analysis = await this.analysisRepository
        .createQueryBuilder('analysis')
        .innerJoin('analysis.project', 'project')
        .where('project.id = :projectId', { projectId })
        .andWhere('project.createdById = :userId', { userId })
        .getOne();
  
      if (!analysis) {
        throw new NotFoundException('Project or analysis not found');
      }
  
      const person = this.personRepository.create({
        ...createPersonDto,
        analysis,
      });
  
      return this.personRepository.save(person);
    }
  }