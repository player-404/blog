import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionSchema } from './entities/permission.entity';
import { PERMISSION_MODEL } from './entities/permission.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PERMISSION_MODEL, schema: PermissionSchema },
    ]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
})
export class PermissionModule {}
