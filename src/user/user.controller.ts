import {
  Controller,
  Post,
  Body,
  Get,
  LoggerService,
  Inject,
  UseGuards,
  HttpCode,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { Public } from '../decorator/my.decoator';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { LocalGuard } from '@/guards/local.auth.guard';
import { AuthService } from '@/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() user: UserDto) {
    const newUser = await this.userService.createUser(user);
    return newUser;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@Req() req: Request) {
    this.logger.log('getAllUsers');
    console.log('user 数据', req.user);
    return await this.userService.getAllUsers();
  }

  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Req() req: { user: UserDto }) {
    const token = await this.authService.createJWT(req.user as any);
    return {
      data: {
        token,
        user: req.user,
      },
    };
  }
}
