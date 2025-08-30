import { ForbiddenException, HttpCode, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ROLE_MODEL } from './entities/role.entity';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(ROLE_MODEL) private roleModel: Model<CreateRoleDto>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const haveRole = await this.roleModel.findOne({
      name: createRoleDto.name,
    });
    if (haveRole) {
      throw new ForbiddenException('角色已存在');
    }
    const newRole = await this.roleModel.create(createRoleDto, { new: true });
    return {
      msg: '创建成功',
      code: 200,
      data: newRole,
    };
  }

  async findAll() {
    const allRoles = await this.roleModel.find();
    return {
      msg: '查询成功',
      code: 200,
      data: allRoles,
    };
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id);
    return {
      msg: '查询成功',
      code: 200,
      data: role,
    };
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const updatedRole = await this.roleModel.findByIdAndUpdate(
      id,
      updateRoleDto,
    );
    return {
      msg: '更新成功',
      code: 200,
      data: updatedRole,
    };
  }
  @HttpCode(200)
  async remove(id: string) {
    const delRole = await this.roleModel.findByIdAndDelete(id);
    return {
      msg: '删除成功',
      code: 200,
      data: delRole,
    };
  }

  async findExits(roldid: string[]): Promise<string[] | string> {
    try {
      return await this.roleModel.find({ _id: { $in: roldid } });
    } catch {
      return [];
    }
  }
}
