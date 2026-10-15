import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
  } from 'typeorm';
  
  @Entity()
  @Unique(['projectId'])
  export class PublicProjectShare {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    projectId: number;
  
    @Column({ unique: true })
    token: string;
  
    @Column({ default: true })
    enabled: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }