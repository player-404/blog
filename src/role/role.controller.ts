import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    console.log('create role', createRoleDto);
    return await this.roleService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    const updateRole = await this.roleService.update(id, updateRoleDto);
    return {
      mes: '修改成功！',
      data: updateRole,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const delRole = await this.roleService.remove(id);
    return {
      msg: '删除成功',
      data: delRole,
    };
  }
}
