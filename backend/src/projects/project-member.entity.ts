import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
  } from 'typeorm';
  
  @Entity()
  @Unique(['projectId', 'userId'])
  export class ProjectMember {
    @PrimaryGeneratedColumn()
    id: number;
  
    // The project this member has access to.
    @Column()
    projectId: number;
  
    // The user who has access to the project.
    @Column()
    userId: number;
  
    // The member's role on this project.
    @Column({
      type: 'varchar',
      default: 'viewer',
    })
    role: 'editor' | 'viewer';
  
    // Automatically set when the member is added.
    @CreateDateColumn()
    createdAt: Date;
  }