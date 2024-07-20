import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, TreeRepository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { BussException } from 'src/common/exception/buss.exception';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class MenuService {
  @InjectRepository(Menu)
  private readonly menuRepository: Repository<Menu>

  @InjectRepository(Menu)
  private readonly menuTreeRepository: TreeRepository<Menu>

  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>

  /**
   * 新增菜单
   * @param createMenuDto 
   * @returns 
   */
  async create(createMenuDto: CreateMenuDto) {
    const isUnique = await this.menuRepository.findOne({
      where: {
        path: createMenuDto.path
      }
    })
    if (isUnique) {
      throw new BussException('菜单路径不可重复')
    }
    const { parentId, ...menuData } = createMenuDto;
    const menu = this.menuRepository.create(menuData);
    if (parentId) {
      const parentMenu = await this.menuRepository.findOne({ where: { id: parentId } });
      if (parentMenu && parentMenu.menuType == 'C') {
        throw new BussException('菜单下无法添加子集,请选择目录后重试');
      }
      if (!parentMenu) {
        throw new BussException('请输入有效的父级ID');
      }
      menu.parent = parentMenu;
    }
    return await this.menuRepository.save(menu);
  }

  /**
   * 获取树形结构菜单
   * @returns 
   */
  async findAll(userInfo) {
    // 角色下有哪些菜单
    const roles = await this.roleRepository.findOne({
      where: {
        name: In(userInfo.roles)
      },
      relations: ['menus']
    })
    const menuIds = roles.menus.map(menu => menu.id);

    // 获取这些菜单项的树形结构
    const menus = await this.menuTreeRepository.findTrees();

    // 过滤掉用户没有权限的菜单项
    const filterMenus = (menus: Menu[]): Menu[] => {
      return menus
        .filter(menu => menuIds.includes(menu.id))
        .map(menu => ({
          ...menu,
          children: filterMenus(menu.children || [])
        }));
    };
    return filterMenus(menus);
  }

  /**
   * 获取扁平化菜单
   */
  async flatMenu(userInfo) {
    // 角色下有哪些菜单
    const roles = await this.roleRepository.findOne({
      where: {
        name: In(userInfo.roles)
      },
      relations: ['menus']
    })
    const menuIds = roles.menus.map(menu => menu.id);
    const allMenu = await this.menuRepository.find();
    allMenu.forEach((menu, index) => {
      if (!menuIds.includes(menu.id)) {
        allMenu.splice(index, 1)
      }
    })
    return allMenu
  }


  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
