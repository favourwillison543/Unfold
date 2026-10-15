import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Analysis } from './analysis.entity';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  type: string | null;

  @Column('text', { array: true, nullable: true })
  responsibilities: string[] | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => Analysis, (analysis) => analysis.people, {
    onDelete: 'CASCADE',
  })
  analysis: Analysis;
}