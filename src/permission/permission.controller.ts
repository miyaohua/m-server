import { Controller, Post, Body } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { requireLogin, requirePermission } from "../common/decorator/auth.decorator";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { DistributionDto } from "./dto/distribution-permission.dto";
import { AddPermissionGroupDto } from "./dto/add-permission-group.dto";
import { DelPermissionGroupDto } from "./dto/del-permission-group.dto";
import { UpdatePermissionGroupDto } from "./dto/update-permission-group.dto";
import { AddPermissionDto } from "./dto/add-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { DelPermissionDto } from "./dto/del-permission.dto";

@ApiTags("权限管理模块")
@Controller("permission")
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {
  }

  @ApiOperation({
    summary: "查询权限组"
  })
  @Post("/getPermissions")
  @requireLogin()
  @requirePermission("query-permissionGroup")
  getPermissions() {
    return this.permissionService.getPermissions();
  }



  @ApiOperation({
    summary: "为角色分配权限"
  })
  @Post("/distributionPermission")
  @requireLogin()
  @requirePermission("distribution-permission")
  distributionPermission(@Body() distributionDto: DistributionDto) {
    return this.permissionService.distributionPermission(distributionDto);
  }

  @ApiOperation({
    summary: "新增权限组"
  })
  @Post('/addPermissionGroup')
  @requireLogin()
  @requirePermission("create-permissionGroup")
  addPermissionGroup(@Body() addPermissionGroupDto: AddPermissionGroupDto) {
    return this.permissionService.addPermissionGroup(addPermissionGroupDto);
  }


  @ApiOperation({
    summary: "删除权限组"
  })
  @Post('/delPermissionGroup')
  @requireLogin()
  @requirePermission("delete-permissionGroup")
  delPermissionGroup(@Body() delPermissionGroupDto: DelPermissionGroupDto) {
    return this.permissionService.delPermissionGroup(delPermissionGroupDto);
  }


  @ApiOperation({
    summary: "更新权限组"
  })
  @Post('/updatePermissionGroup')
  @requireLogin()
  @requirePermission("update-permissionGroup")
  updatePermissionGroup(@Body() updatePermissionGroupDto: UpdatePermissionGroupDto) {
    return this.permissionService.updatePermissionGroup(updatePermissionGroupDto);
  }


  @ApiOperation({
    summary: "新增权限"
  })
  @Post('/addPermission')
  @requireLogin()
  @requirePermission("create-permission")
  addPermission(@Body() addPermissionDto: AddPermissionDto) {
    return this.permissionService.addPermission(addPermissionDto)
  }


  @ApiOperation({
    summary: "更新权限"
  })
  @Post('/updatePermission')
  @requireLogin()
  @requirePermission("update-permission")
  updatePermission(@Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.updatePermission(updatePermissionDto)
  }



  @ApiOperation({
    summary: "删除权限"
  })
  @Post('/delPermission')
  @requireLogin()
  @requirePermission("delete-permission")
  delPermission(@Body() delPermissionDto: DelPermissionDto) {
    return this.permissionService.delPermission(delPermissionDto)
  }

}
