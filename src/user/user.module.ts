import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { PermissionGroup } from './entities/permissionGroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, Menu, PermissionGroup])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
