import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
  
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
  
    return {
      message: 'Account created successfully',
      user,
      accessToken: token,
    };
  }

  async login(email: string, password: string) {
    const user =
      await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    const {
      password: _password,
      ...userWithoutPassword
    } = user;

    return {
      user: userWithoutPassword,
      accessToken: token,
    };
  }
}