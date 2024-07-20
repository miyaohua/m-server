import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'
import { Role } from 'src/role/entities/role.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { PermissionGroup } from 'src/permission/entities/permissionGroup.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission, Menu, PermissionGroup])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
