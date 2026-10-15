import { Body, Controller, Get, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {

  // Gives the controller access to UsersService.
  constructor(
    private readonly usersService: UsersService,
  ) {}

  // ---------------------------------------------------------
  // GET /users
  // Get all users.
  // ---------------------------------------------------------
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  // ---------------------------------------------------------
  // POST /users
  // Create a new user.
  // ---------------------------------------------------------
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {

    // @Body() extracts the JSON request body.
    //
    // Example:
    // {
    //   "name": "Favour",
    //   "email": "favour@example.com",
    //   "password": "password123"
    // }
    //
    // CreateUserDto defines and validates what we're expecting.
    return this.usersService.createUser(createUserDto);
  }
}