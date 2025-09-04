import { SetMetadata } from '@nestjs/common';
import { action, PERMISSION_KEY } from '@/enum/permission.enum';

export const update = () => SetMetadata(PERMISSION_KEY, action.UPDATE);

export const deletes = () => SetMetadata(PERMISSION_KEY, action.DELETE);

export const create = () => SetMetadata(PERMISSION_KEY, action.CREATE);

export const read = () => SetMetadata(PERMISSION_KEY, action.READ);
