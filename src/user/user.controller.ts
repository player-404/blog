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
  Patch,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LocalGuard } from '@/guards/local.auth.guard';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/decorator/my.decoator';
import { ValidateRolesIdGuard } from './guards/validate-rolesid.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @Public()
  @UseGuards(ValidateRolesIdGuard)
  async createUser(@Body() user: UserDto) {
    console.log('user', user);
    const newUser = await this.userService.createUser(user);
    return newUser;
  }

  @Get()
  async getAllUsers(@Req() req: Request) {
    this.logger.log('getAllUsers');
    console.log('user 数据', req.user);
    const allUsers = await this.userService.getAllUsers();

    return {
      msg: '查询成功',
      code: 200,
      data: allUsers,
    };
  }

  @Public()
  @Get('test')
  test() {
    return 'test';
  }

  @Public()
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

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: updateUserDto,
  ) {
    const updateUser = await this.userService.updateUser(id, updateUserDto);
    return {
      mes: '修改成功！',
      data: updateUser,
    };
  }

  @Get('id')
  async findOneUser(@Param('id') id: string) {
    const user = await this.userService.findOneUser(id);
    return {
      msg: '查询成功',
      code: 200,
      data: user,
    };
  }
}
