import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

import { ProductType } from './product-type.entity';
import { ProductArea } from './product-area.entity';
import { Project } from '../../projects/project.entity';
import { Person } from './person.entity';
import { Question } from './question.entity';
import { ActorGoal } from './actor-goal.entity';
import { ProductEntity } from './product-entity.entity';
import { ProductRelationship } from './product-relationship.entity';

@Entity()
export class Analysis {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(
        () => Project,
        (project) => project.analysis,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn()
    project: Project;

    @Column({ type: 'text', nullable: true })
    understanding: string | null;

    @OneToMany(() => ProductType, (productType) => productType.analysis)
    productTypes: ProductType[];

    @OneToMany(() => ProductArea, (productArea) => productArea.analysis)
    productAreas: ProductArea[];

    @OneToMany(() => Person, (person) => person.analysis)
    people: Person[];

    @OneToMany(() => Question, (question) => question.analysis)
    questions: Question[];

    @OneToMany(() => ActorGoal, (actorGoal) => actorGoal.analysis)
    actorGoals: ActorGoal[];

    @Column('jsonb', { nullable: true })
    productModel: {
        role: string;
        directCustomer: string;
        usageMode: string;
        primaryInterfaces: string[];
    } | null;

    @OneToMany(
        () => ProductEntity,
        (entity) => entity.analysis,
    )
    entities: ProductEntity[];

    @OneToMany(
        () => ProductRelationship,
        (relationship) => relationship.analysis,
    )
    relationships: ProductRelationship[];
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
  uncertainties: never[];
}