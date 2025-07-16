import mongoose from 'mongoose';
import { IUser } from './user.dto';

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
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, ret: IUser) => {
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret: IUser) => {
        delete ret.password;
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

userSchema.pre('save', function () {});
export const USER_MODEL = 'User';
