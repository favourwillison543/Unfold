import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Analysis } from '../analysis/entities/analysis.entity';

@Entity()
export class Project {

  @OneToOne(() => Analysis, (analysis) => analysis.project)
  analysis: Analysis;



  // Automatically generated unique ID for the project.
  @PrimaryGeneratedColumn()
  id: number;

  // The name of the project.
  @Column()
  name: string;

  // Optional description of the project.
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  productFormat: string;
  // ID of the user who created this project.
  // This comes from the authenticated user's JWT,
  // not from the request body.
  @Column()
  createdById: number;

  // Automatically set when the project is created.
  @CreateDateColumn()
  createdAt: Date;

  // Automatically updated whenever the project changes.
  @UpdateDateColumn()
  updatedAt: Date;
}