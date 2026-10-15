import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Analysis } from './analysis.entity';
  

  
  @Entity()
  export class ProductArea {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description: string | null;
  
    @ManyToOne(() => Analysis, (analysis) => analysis.productAreas, {
      onDelete: 'CASCADE',
    })
    analysis: Analysis;
  }