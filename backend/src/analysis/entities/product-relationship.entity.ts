import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Analysis } from './analysis.entity';
  
  @Entity()
  export class ProductRelationship {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    from: string;
  
    @Column()
    relationship: string;
  
    @Column()
    to: string;
  
    @ManyToOne(
      () => Analysis,
      (analysis) => analysis.relationships,
      {
        onDelete: 'CASCADE',
      },
    )
    analysis: Analysis;
  }