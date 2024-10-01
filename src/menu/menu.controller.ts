import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { AllocationMenuDto } from './dto/AllocationMenu.dto'
import { MenuByNumDto } from './dto/MenuByNum.dto'
import { requireLogin, requirePermission, UserInfo } from 'src/common/decorator/auth.decorator';
import { DelMenuDto } from './dto/DelMenu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }


  @Post()
  @requireLogin()
  @requirePermission("create-menu")
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
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
  menuByNum(@Body() menuByNumDto: MenuByNumDto) {
    return this.menuService.menuByNum(menuByNumDto)
  }


  @Post('/delMenu')
  @requireLogin()
  delMenu(@Body() delMenuDto: DelMenuDto) {
    return this.menuService.delMenu(delMenuDto)
  }

}
