import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Workflow } from './workflow.entity';
  
  @Entity()
  export class WorkflowPage {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'text' })
    purpose: string;
  
    @ManyToOne(
      () => Workflow,
      (workflow) => workflow.pages,
      {
        onDelete: 'CASCADE',
      },
    )
    workflow: Workflow;
  }