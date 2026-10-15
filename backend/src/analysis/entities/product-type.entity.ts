import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Analysis } from './analysis.entity';
  
  @Entity()
  export class ProductType {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @ManyToOne(() => Analysis, (analysis) => analysis.productTypes, {
      onDelete: 'CASCADE',
    })
    analysis: Analysis;
  }