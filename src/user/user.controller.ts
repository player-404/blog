import { ConfigService } from '@nestjs/config';
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
  Res,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { updateUserDto, UserDto } from './user.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LocalGuard } from '@/guards/local.auth.guard';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/decorator/my.decoator';
import { ValidateRolesIdGuard } from './guards/validate-rolesid.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { update, permission } from '@/decorator/role.permission';
import { RolePermissionGuard } from '@/guards/role-permission.guard';
import { Response } from 'express';

@Controller('user')
@permission('admin')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @Public()
  @UseGuards(ValidateRolesIdGuard)
  async createUser(@Body() user: UserDto) {
    console.log('user', user);
    const newUser = await this.userService.createUser(user);
    return {
      msg: '创建成功',
      code: 200,
      data: newUser,
    };
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
  async login(
    @Req() req: { user: UserDto },
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = await this.authService.createJWT(req.user as any);
    const refreshToken = await this.authService.createRefreshToken(
      req.user as any,
    );
    // assess token
    response.cookie('AS_TOKEN', token, {
      maxAge: 1000 * 60 * 60 * 24 * 1,
      sameSite: 'lax', // CSRF 保护
      secure: false,
    });
    // refresh token
    response.cookie('REFRESH_TOKEN', refreshToken, {
      maxAge: 1000 * 30 * 60,
      sameSite: 'lax', // CSRF 保护
      secure: false,
    });
    return {
      data: {
        token,
        refreshToken,
        user: req.user,
      },
    };
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserData: updateUserDto,
  ) {
    const updateUser = await this.userService.updateUser(id, updateUserData);
    return {
      mes: '修改成功！',
      data: updateUser,
    };
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string) {
    console.log('查询的Id', id);
    const user = await this.userService.findUserById(id);
    return {
      msg: '查询成功',
      code: 200,
      data: user,
    };
  }

  // 权限更新
  @Patch('role/:id')
  @UseGuards(RolePermissionGuard)
  @update()
  async updateUserRole(
    @Param('id') id: string,
    @Body() updateUserData: UpdateRoleDto,
  ) {
    const data = await this.userService.updateUserRoles(
      id,
      updateUserData.roles,
    );
    return {
      msg: '权限更新成功',
      code: 200,
      data,
    };
  }
}
