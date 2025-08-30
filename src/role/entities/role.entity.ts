import mongoose from 'mongoose';
import { PERMISSION_MODEL } from '@/permission/entities/permission.entity';

export const RoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
    },
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: PERMISSION_MODEL,
    },
  },
  {
    timestamps: true,
  },
);

export const ROLE_MODEL = 'Roles';
