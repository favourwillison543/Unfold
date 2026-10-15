import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from '../../projects/project.entity';
import { WorkflowStep } from './workflow-step.entity';
import { WorkflowPage } from './workflow-page.entity';
import { WorkflowConnection } from './workflow-connection.entity';

@Entity()
export class Workflow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  actor: string;

  @Column()
  goal: string;

  @Column({ type: 'text', nullable: true })
  entryPoint: string | null;

  @Column({ type: 'text', nullable: true })
  completion: string | null;

  @ManyToOne(() => Project, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @OneToMany(
    () => WorkflowStep,
    (step) => step.workflow,
    {
      cascade: true,
    },
  )
  steps: WorkflowStep[];

  @OneToMany(
    () => WorkflowPage,
    (page) => page.workflow,
    {
      cascade: true,
    },
  )
  pages: WorkflowPage[];

  @OneToMany(
    () => WorkflowConnection,
    (connection) => connection.workflow,
    {
      cascade: true,
    },
  )
  connections: WorkflowConnection[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}