import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL } from './user.schema';
import { Model } from 'mongoose';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL) private readonly userModel: Model<UserDto>,
  ) {}
  async createUser(user: UserDto) {
    const newUser = await this.userModel.create(user);
    return newUser;
  }
  async findOneUser(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }
}
