import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
  } from 'typeorm';
  
  @Entity()
  @Unique(['projectId', 'email'])
  export class ProjectInvitation {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    projectId: number;
  
    @Column()
    email: string;
  
    @Column({
      type: 'varchar',
      default: 'viewer',
    })
    role: 'editor' | 'viewer';
  
    @Column({ unique: true })
    token: string;
  
    @Column({ type: 'timestamp' })
    expiresAt: Date;
  
    @Column({ type: 'timestamp', nullable: true })
    acceptedAt: Date | null;
  
    @CreateDateColumn()
    createdAt: Date;
  }