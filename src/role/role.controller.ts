import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoleService } from './role.service';
import { requireLogin, requirePermission } from 'src/common/decorator/auth.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { GetAllRoleDto } from './dto/getAllRole.dto'

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @ApiOperation({
    summary: '角色分页查询'
  })
  @Post('/getAllRole')
  @requireLogin()
  @requirePermission('query-role')
  getAllRole(getAllRoleDto: GetAllRoleDto) {
    return this.roleService.getAllRole(getAllRoleDto)
  }


  @ApiOperation({
    summary: '角色查询'
  })
  @Post('/getRole')
  @requireLogin()
  @requirePermission('query-role')
  getRole() {
    return this.roleService.getRole()
  }

}
