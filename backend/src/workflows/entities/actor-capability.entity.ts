import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { Actor } from './actor.entity';
  
  @Entity('actor_capabilities')
  export class ActorCapability {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'text' })
    description: string;
  
    @ManyToOne(() => Actor, (actor) => actor.capabilities, {
      onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'actorId' })
    actor: Actor;
  
    @Column()
    actorId: number;
  }