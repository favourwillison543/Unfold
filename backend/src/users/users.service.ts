import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUsers() {
    return this.userRepository.find();
  }

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.userRepository.save(user);

      const { password, ...userWithoutPassword } = savedUser;

      return userWithoutPassword;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === '23505'
      ) {
        throw new ConflictException('Email already exists');
      }
    
      throw error;
    }
  }

  async findByEmailWithPassword(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }


  async setVerificationOtp(
    userId: number,
    otpHash: string,
    expiresAt: Date,
  ) {
    await this.userRepository.update(userId, {
      verificationOtpHash: otpHash,
      verificationOtpExpiresAt: expiresAt,
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async verifyEmail(userId: number) {
    await this.userRepository.update(userId, {
      emailVerified: true,
      verificationOtpHash: null,
      verificationOtpExpiresAt: null,
    });
  }
}