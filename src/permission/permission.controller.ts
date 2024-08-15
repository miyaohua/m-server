import { Controller, Post, Body } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { requireLogin, requirePermission } from "../common/decorator/auth.decorator";
import { ApiOperation } from "@nestjs/swagger";
import { DistributionDto } from "./dto/Distribution.dto";

@Controller("permission")
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {
  }

  @ApiOperation({
    summary: "根据组获取角色"
  })
  @Post("/getPermissions")
  @requireLogin()
  @requirePermission("query-permission")
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

}
