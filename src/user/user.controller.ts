import {
  Controller,
  Post,
  Body,
  Get,
  LoggerService,
  Inject,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { Public } from '../decorator/my.decoator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: { user: UserDto }) {
    return req.user;
  }
}
