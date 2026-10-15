import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  
  import { ProductArea } from './entities/product-area.entity';
  import { Analysis } from './entities/analysis.entity';
  import { CreateProductAreaDto } from './dto/create-product-area.dto';
  
  @Injectable()
  export class ProductAreasService {
    constructor(
      @InjectRepository(ProductArea)
      private readonly productAreaRepository: Repository<ProductArea>,
  
      @InjectRepository(Analysis)
      private readonly analysisRepository: Repository<Analysis>,
    ) {}
  
    async createProductArea(
      projectId: number,
      userId: number,
      createProductAreaDto: CreateProductAreaDto,
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
  
      const productArea = this.productAreaRepository.create({
        ...createProductAreaDto,
        analysis,
      });
  
      return this.productAreaRepository.save(productArea);
    }
  }