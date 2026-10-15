import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Analysis } from './analysis.entity';
  
  @Entity()
  export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @ManyToOne(
      () => Analysis,
      (analysis) => analysis.entities,
      {
        onDelete: 'CASCADE',
      },
    )
    analysis: Analysis;
  }