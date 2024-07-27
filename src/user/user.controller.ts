import { Controller, Get, Post, Body, Patch, Param, Delete, SetMetadata } from '@nestjs/common';
import { UserService } from './user.service';
import { RegistryDto } from './dto/registry.dto'
import { RegistrySendEmailDto } from './dto/registrySendEmail.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { requireLogin, requirePermission } from 'src/common/decorator/auth.decorator';
import { GetAllDto } from './dto/getAll.dto';
import { DelUserDto } from './dto/delUser.dto'
import { ChangeUserStatusDto } from './dto/changeUserStatus.dto';
import { addUserDto } from './dto/addUser.dto'
import { EditUserDto } from './dto/editUser.dto';

@ApiTags('用户管理模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({
    summary: '注册用户'
  })
  @Post('/registry')
  registry(@Body() registryDto: RegistryDto) {
    return this.userService.registry(registryDto)
  }

  @ApiOperation({
    summary: '用户登录'
  })
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto)
  }

  @ApiOperation({
    summary: '用户注册发送邮箱'
  })
  @Post('/registrySendEmail')
  registrySendEmail(@Body() registrySendEmailDto: RegistrySendEmailDto) {
    return this.userService.registrySendEmail(registrySendEmailDto)
  }

  @ApiOperation({
    summary: '获取计算验证码'
  })
  @Post('/getPicCode')
  getPicCode() {
    return this.userService.getPicCode();
  }

  @ApiOperation({
    summary: '用户分页查询'
  })
  @Post('/getAllUser')
  @requireLogin()
  @requirePermission('query-user')
  getAllUser(@Body() getAllDto: GetAllDto) {
    return this.userService.getAllUser(getAllDto)
  }


  @ApiOperation({
    summary: '删除用户'
  })
  @requireLogin()
  @requirePermission('delete-user')
  @Post('/delUser')
  delUser(@Body() delUserDto: DelUserDto) {
    return this.userService.delUser(delUserDto)
  }


  @ApiOperation({
    summary: '修改用户状态'
  })
  @requireLogin()
  @requirePermission('update-user')
  @Post('/changeUserStatus')
  changeUserStatus(@Body() changeUserStatusDto: ChangeUserStatusDto) {
    return this.userService.changeUserStatus(changeUserStatusDto)
  }


  @ApiOperation({
    summary: '新增用户'
  })
  @requireLogin()
  @requirePermission('create-user')
  @Post('/addUser')
  addUser(@Body() addUserDto: addUserDto) {
    this.userService.addUser(addUserDto)
  }



  @ApiOperation({
    summary: '修改用户'
  })
  @requireLogin()
  @requirePermission('update-user')
  @Post('/editUser')
  editUser(@Body() editUserDto: EditUserDto) {
    return this.userService.editUser(editUserDto)
  }


  // 跑测试数据
  @Post('runData')
  runData() {
    return this.userService.runData()
  }
}
