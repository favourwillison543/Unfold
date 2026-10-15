import {
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { ProductType } from './entities/product-type.entity';
  import { Analysis } from './entities/analysis.entity';
  import { CreateProductTypeDto } from './dto/create-product-type.dto';
  
  @Injectable()
  export class ProductTypesService {
    constructor(
      @InjectRepository(ProductType)
      private readonly productTypeRepository: Repository<ProductType>,
  
      @InjectRepository(Analysis)
      private readonly analysisRepository: Repository<Analysis>,
    ) {}
  
    async createProductType(
        projectId: number,
        userId: number,
        createProductTypeDto: CreateProductTypeDto,
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
      
        const productType = this.productTypeRepository.create({
          ...createProductTypeDto,
          analysis,
        });
      
        return this.productTypeRepository.save(productType);
      }
  }