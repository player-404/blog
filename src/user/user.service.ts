import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL } from './user.schema';
import { Model } from 'mongoose';
import { UserDto, updateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDto>,
  ) {}

  async createUser(user: UserDto) {
    const haveUser = await this.userModel.findOne({ username: user.username });
    if (haveUser) {
      throw new ForbiddenException('用户已存在');
    }
    const newUser = await this.userModel.create(user);
    return newUser;
  }

  async findUserById(id: string) {
    const user = await this.userModel.findById(id).populate('roles');

    return user;
  }

  async getAllUsers() {
    const allUsers = await this.userModel.find();
    return allUsers;
  }

  async updateUser(id: string, user: updateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, {
      new: true,
    });
    return updatedUser;
  }

  async findOneUser(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async updateUserRoles() {}
}
