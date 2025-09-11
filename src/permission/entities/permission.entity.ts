import mongoose from 'mongoose';

export const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    action: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PERMISSION_MODEL = 'Permission';
