import mongoose from 'mongoose';
import { PERMISSION_MODEL } from '@/permission/entities/permission.entity';

export const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '请输入角色名称'],
      unique: [true, '角色已经存在'],
    },
    description: {
      type: String,
    },
    permission: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: PERMISSION_MODEL,
      },
    ],
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const ROLE_MODEL = 'Roles';
