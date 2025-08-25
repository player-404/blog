import { Injectable } from '@nestjs/common';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PERMISSION_MODEL } from './entities/permission.entity';
import { Model } from 'mongoose';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(PERMISSION_MODEL)
    private permissionModel: Model<CreatePermissionDto>,
  ) {}
  async create(createPermissionDto: CreatePermissionDto) {
    const permission = await this.permissionModel.create(createPermissionDto);
    return permission;
  }

  async findAll() {
    const allPermission = await this.permissionModel.find();
    return allPermission;
  }

  async findOne(id: string) {
    const permission = await this.permissionModel.findById(id);
    return permission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const updatePermission = await this.permissionModel.findByIdAndUpdate(
      id,
      updatePermissionDto,
    );
    return updatePermission;
  }

  async remove(id: string) {
    const delPermission = await this.permissionModel.findByIdAndDelete(id);
    return delPermission;
  }
}
