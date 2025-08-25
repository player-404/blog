import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const permission = await this.permissionService.create(createPermissionDto);
    return {
      msg: '权限创建成功',
      code: 200,
      data: permission,
    };
  }

  @Get()
  async findAll() {
    const allPermissions = await this.permissionService.findAll();
    return {
      msg: '查询成功',
      code: 200,
      data: allPermissions,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const permission = await this.permissionService.findOne(id);
    return {
      msg: '查询成功',
      code: 200,
      data: permission,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    const permission = await this.permissionService.update(
      id,
      updatePermissionDto,
    );
    return {
      code: 200,
      msg: '更新成功',
      data: permission,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const permission = this.permissionService.remove(id);
    return {
      code: 200,
      msg: '删除成功',
      data: permission,
    };
  }
}
