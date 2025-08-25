import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ROLE_MODEL } from './entities/role.entity';
import { RoleSchema } from './entities/role.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ROLE_MODEL,
        schema: RoleSchema,
      },
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
