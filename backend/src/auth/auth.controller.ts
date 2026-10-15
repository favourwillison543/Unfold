import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { AuthService } from './auth.service';

import { CreateUserDto } from '../users/dto/create-user.dto';

import { UsersService } from '../users/users.service';

import { Public } from './public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ) {
    // Create the account and send the verification OTP.
    // No login cookie is created yet.
    return this.authService.signup(createUserDto);
  }

  @Public()
  @Post('resend-verification')
  async resendVerification(
    @Body('email') email: string,
  ) {
    // Generate and send a new verification OTP.
    return this.authService.resendVerification(email);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Verify the OTP and create the JWT.
    const result =
      await this.authService.verifyEmail(
        email,
        otp,
      );

    // Only create the login cookie after successful verification.
    response.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      user: result.user,
    };
  }

  @Public()
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.login(
      email,
      password,
    );

    response.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      user: result.user,
    };
  }

  @Public()
  @Post('logout')
  logout(
    @Res({ passthrough: true }) response: Response,
  ) {
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: 'Logged out successfully',
    };
  }

  @Get('me')
  async getMe(@Req() request: any) {
    const userId = request.user.sub;

    return this.usersService.findById(userId);
  }
}