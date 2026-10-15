import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  import { Project } from '../../projects/project.entity';
  
  @Entity()
  export class Challenge {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @Column()
    severity: string;
  
    @Column({ type: 'text', nullable: true })
    relatedActor: string | null;
  
    @Column({ type: 'text', nullable: true })
    relatedWorkflow: string | null;
  
    @Column({ type: 'text', nullable: true })
    suggestedQuestion: string | null;
  
    @Column({ default: false })
    resolved: boolean;
  
    @ManyToOne(() => Project, {
      onDelete: 'CASCADE',
    })
    project: Project;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }