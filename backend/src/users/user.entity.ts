import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  // Automatically generated unique ID.
  @PrimaryGeneratedColumn()
  id: number;

  // The user's name.
  @Column()
  name: string;

  // The user's email.
  // unique: true means two users cannot have the same email.
  @Column({ unique: true })
  email: string;

  // The user's password.
  // select: false means it is not returned by normal queries.
  @Column({ select: false })
  password: string;

  // Whether the user has successfully verified their email.
@Column({ type: 'boolean', default: false })
emailVerified: boolean;

// Hashed email verification OTP.
@Column({ type: 'varchar', nullable: true })
verificationOtpHash: string | null;

// Time when the verification OTP expires.
@Column({ type: 'timestamp', nullable: true })
verificationOtpExpiresAt: Date | null;

  // Automatically set when the user is created.
  @CreateDateColumn()
  createdAt: Date;

  // Automatically updated whenever the user changes.
  @UpdateDateColumn()
  updatedAt: Date;
}