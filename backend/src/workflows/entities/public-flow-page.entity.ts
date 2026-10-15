import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Project } from '../../projects/project.entity';
  
  @Entity('public_flow_pages')
  export class PublicFlowPage {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    purpose: string;
  
    @Column({ nullable: true, type: 'text' })
    description: string | null;
  
    @ManyToOne(() => Project, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'projectId' })
    project: Project;
  
    @Column()
    projectId: number;
  
    @CreateDateColumn()
    createdAt: Date;
  }