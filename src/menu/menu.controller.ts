import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { AllocationMenuDto } from './dto/allocation-menu.dto'
import { MenuByNumDto } from './dto/num-menu.dto'
import { requireLogin, requirePermission, UserInfo } from '../common/decorator/auth.decorator';
import { DelMenuDto } from './dto/del-menu.dto';
import { ApiTags } from '@nestjs/swagger';
import { EditMenuDto } from './dto/edit-menu.dto';

@ApiTags("菜单管理模块")
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }


  @Post()
  @requireLogin()
  @requirePermission("create-menu")
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }


  @Post('/edit')
  @requireLogin()
  @requirePermission("update-menu")
  edit(@Body() editMenuDto: EditMenuDto) {
    return this.menuService.edit(editMenuDto);
  }



  @Get()
  @requireLogin()
  findAll(@UserInfo() userInfo) {
    return this.menuService.findAll(userInfo);
  }


  @Get('/allMenu')
  @requireLogin()
  allMenu() {
    return this.menuService.allMenu();
  }

  @Post('/flatMenu')
  @requireLogin()
  flagMenu(@UserInfo() userInfo) {
    return this.menuService.flatMenu(userInfo)
  }

  @Post('/allocationMenu')
  @requireLogin()
  @requirePermission("distribution-menu")
  allocationMenu(@Body() allocationMenuDto: AllocationMenuDto) {
    return this.menuService.allocationMenu(allocationMenuDto)
  }


  @Post('/menuByNum')
  @requireLogin()
  @requirePermission("query-menu")
  menuByNum(@Body() menuByNumDto: MenuByNumDto) {
    return this.menuService.menuByNum(menuByNumDto)
  }


  @Post('/delMenu')
  @requireLogin()
  delMenu(@Body() delMenuDto: DelMenuDto) {
    return this.menuService.delMenu(delMenuDto)
  }

}
