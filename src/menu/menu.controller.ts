import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { requireLogin, requirePermission, UserInfo } from 'src/common/decorator/auth.decorator';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @requireLogin()
  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @requireLogin()
  @Get()
  findAll(@UserInfo() userInfo) {
    return this.menuService.findAll(userInfo);
  }

  @requireLogin()
  @Post('/flatMenu')
  flagMenu(@UserInfo() userInfo) {
    return this.menuService.flatMenu(userInfo)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
