import mongoose from 'mongoose';
import { IUser } from './user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';
import { ROLE_MODEL } from '@/role/entities/role.entity';

export const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, '用户名不能为空'],
      unique: [true, '用户名已存在'],
    },
    password: {
      type: String,
      required: [true, '密码不能为空'],
      minlength: [6, '密码长度不能小于6位'],
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: ROLE_MODEL,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret: IUser) => {
        delete ret.password;
        delete ret.confirmPassword;
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret: IUser) => {
        delete ret.password;
        delete ret.confirmPassword;
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
  },
);

userSchema
  .virtual('confirmPassword')
  .set(function (value: string) {
    this._confirmPassword = value;
  })
  .get(function () {
    return this._confirmPassword;
  });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  if (this.password !== this.confirmPassword) {
    throw new HttpException('密码不一致', HttpStatus.BAD_REQUEST);
  }
  if (this.password) {
    this.password = await argon2.hash(this.password);
  }
  next();
});
export const USER_MODEL = 'User';
