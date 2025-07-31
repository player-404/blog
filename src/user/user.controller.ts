import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { Public } from '../decorator/my.decoator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  @Post()
  async createUser(@Body() user: UserDto) {
    const newUser = await this.userService.createUser(user);
    return newUser;
  }

  @Public()
  @Get()
  async getAllUsers() {
    this.logger.log('getAllUsers');
    return await this.userService.getAllUsers();
  }
}
