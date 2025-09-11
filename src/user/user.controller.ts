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
import { updateUserDto, UserDto } from './user.dto';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { LocalGuard } from '@/guards/local.auth.guard';
import { AuthService } from '@/auth/auth.service';
import { Public } from '@/decorator/my.decoator';
import { ValidateRolesIdGuard } from './guards/validate-rolesid.guard';
import { UpdateRoleDto } from './dto/update-role.dto';
import { update, permission } from '@/decorator/role.permission';
import { RolePermissionGuard } from '@/guards/role-permission.guard';

@Controller('user')
@permission('admin')
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
