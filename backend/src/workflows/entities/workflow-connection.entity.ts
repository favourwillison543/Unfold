import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Workflow } from './workflow.entity';
  
  @Entity()
  export class WorkflowConnection {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    from: string;
  
    @Column()
    to: string;
  
    @Column({ type: 'text', nullable: true })
    condition: string | null;
  
    @ManyToOne(
      () => Workflow,
      (workflow) => workflow.connections,
      {
        onDelete: 'CASCADE',
      },
    )
    workflow: Workflow;
  }