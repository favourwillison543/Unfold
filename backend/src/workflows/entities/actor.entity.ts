import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Project } from '../../projects/project.entity';
  import { ActorPage } from './actor-page.entity';
  import { ActorCapability } from './actor-capability.entity';
  
  @Entity('actors')
  export class Actor {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Project;
  
    @Column()
    projectId: number;
  
    @OneToMany(() => ActorPage, (page) => page.actor, { cascade: true })
    pages: ActorPage[];
  
    @OneToMany(() => ActorCapability, (capability) => capability.actor, {
      cascade: true,
    })
    capabilities: ActorCapability[];
  
    @CreateDateColumn()
    createdAt: Date;
  }