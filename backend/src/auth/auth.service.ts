import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { randomInt } from 'crypto';

import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    // We need UsersService to find and create users.
    private readonly usersService: UsersService,

    // We need JwtService to create JWT tokens.
    private readonly jwtService: JwtService,

    // We use EmailService to send OTP emails.
    private readonly emailService: EmailService,
  ) {}

  async signup(createUserDto: CreateUserDto) {
    // Create the user using UsersService.
    // The password is hashed inside createUser().
    const user =
      await this.usersService.createUser(createUserDto);

    // Generate a secure 6-digit OTP.
    const otp = randomInt(100000, 1000000).toString();

    // Hash the OTP before storing it in the database.
    const otpHash = await bcrypt.hash(otp, 10);

    // OTP expires after 10 minutes.
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    // Save the hashed OTP and expiry time.
    await this.usersService.setVerificationOtp(
      user.id,
      otpHash,
      expiresAt,
    );

    // Send the actual OTP to the user's email.
    await this.emailService.sendVerificationOtp(
      user.email,
      otp,
    );

    // Do NOT create the login cookie yet.
    // The user must verify their email first.
    return {
      message: 'Verification code sent to your email',
      email: user.email,
    };
  }

  async resendVerification(email: string) {
    // Find the user by email.
    const user =
      await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'Unable to resend verification code',
      );
    }

    // Do not send another verification code
    // if the email has already been verified.
    if (user.emailVerified) {
      throw new UnauthorizedException(
        'Email is already verified',
      );
    }

    // Generate a new secure 6-digit OTP.
    const otp = randomInt(100000, 1000000).toString();

    // Hash the new OTP before storing it in the database.
    const otpHash = await bcrypt.hash(otp, 10);

    // Give the new OTP a fresh 10-minute expiry.
    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    // Replace the previous OTP with the new one.
    await this.usersService.setVerificationOtp(
      user.id,
      otpHash,
      expiresAt,
    );

    // Send the new OTP using the existing Resend setup.
    await this.emailService.sendVerificationOtp(
      user.email,
      otp,
    );

    return {
      message: 'A new verification code has been sent',
      email: user.email,
    };
  }

  async verifyEmail(email: string, otp: string) {
    // Find the user by email.
    const user =
      await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid verification code',
      );
    }

    // If the email is already verified, there is nothing to verify.
    if (user.emailVerified) {
      throw new UnauthorizedException(
        'Email is already verified',
      );
    }

    // Make sure an OTP exists.
    if (
      !user.verificationOtpHash ||
      !user.verificationOtpExpiresAt
    ) {
      throw new UnauthorizedException(
        'Verification code is invalid or expired',
      );
    }

    // Check whether the OTP has expired.
    if (new Date() > user.verificationOtpExpiresAt) {
      throw new UnauthorizedException(
        'Verification code has expired',
      );
    }

    // Compare the submitted OTP with the stored hash.
    const otpMatches = await bcrypt.compare(
      otp,
      user.verificationOtpHash,
    );

    if (!otpMatches) {
      throw new UnauthorizedException(
        'Invalid verification code',
      );
    }

    // Mark the email as verified and remove the OTP.
    await this.usersService.verifyEmail(user.id);

    // Now create the JWT.
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user,
      accessToken: token,
    };
  }

  async login(email: string, password: string) {
    // Find the user by email and include their password hash.
    const user =
      await this.usersService.findByEmailWithPassword(
        email,
      );

    // If the email doesn't exist, reject the login.
    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // Don't allow an unverified user to log in.
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    // Compare the password entered by the user
    // with the hashed password stored in the database.
    const passwordMatches = await bcrypt.compare(
      password,
      user.password,
    );

    // If they don't match, reject the login.
    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    // Password is correct, so create a JWT.
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    // Remove the password from the user object.
    const { password: _, ...userWithoutPassword } = user;

    // Return the user and JWT.
    return {
      user: userWithoutPassword,
      accessToken: token,
    };
  }
}