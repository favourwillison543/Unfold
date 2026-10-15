import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Workflow } from './workflow.entity';

@Entity()
export class WorkflowStep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'varchar',
  })
  type: string;
  
  @Column({ type: 'varchar', nullable: true })
  actor: string | null;
  
  @Column({ type: 'varchar', nullable: true })
  page: string | null;
  
  @Column({ type: 'text', nullable: true })
  description: string | null;
  @Column()
  stepOrder: number;

  @ManyToOne(
    () => Workflow,
    (workflow) => workflow.steps,
    {
      onDelete: 'CASCADE',
    },
  )
  workflow: Workflow;
}