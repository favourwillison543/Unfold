import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Analysis } from './analysis.entity';
  
  @Entity()
  export class ActorGoal {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    actor: string;
  
    @Column({ type: 'text' })
    goal: string;
  
    @ManyToOne(() => Analysis, (analysis) => analysis.actorGoals, {
      onDelete: 'CASCADE',
    })
    analysis: Analysis;
  }