import { Module } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { PermissionController } from "./permission.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { PermissionGroup } from "./entities/permissionGroup.entity";
import { Role } from "../role/entities/role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Permission, PermissionGroup,Role])],
  controllers: [PermissionController],
  providers: [PermissionService]
})
export class PermissionModule {
}
