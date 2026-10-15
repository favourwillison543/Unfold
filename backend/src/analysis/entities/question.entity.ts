import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Analysis } from './analysis.entity';
  
  @Entity()
  export class Question {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    question: string;
  
    @Column('jsonb')
    options: {
      label: string;
      value: string;
    }[];
  
    @Column({ type: 'text', nullable: true })
    answer: string | null;
  
    @Column({ type: 'text', nullable: true })
    reason: string | null;
  
    @ManyToOne(() => Analysis, (analysis) => analysis.questions, {
      onDelete: 'CASCADE',
    })
    analysis: Analysis;
  }