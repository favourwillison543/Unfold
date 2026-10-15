import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Actor } from './actor.entity';
  
  @Entity('actor_pages')
  export class ActorPage {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column()
    purpose: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @ManyToOne(() => Actor, (actor) => actor.pages, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'actorId' })
    actor: Actor;
  
    @Column()
    actorId: number;
  }