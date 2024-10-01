import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, TreeRepository } from 'typeorm';
import { Menu } from './entities/menu.entity';
import { BussException } from 'src/common/exception/buss.exception';
import { User } from 'src/user/entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { AllocationMenuDto } from './dto/AllocationMenu.dto';
import { MenuByNumDto } from './dto/MenuByNum.dto';

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
   * 获取有权限的树形结构菜单
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
    const menuIds = roles?.menus.map(menu => menu.id) || [];

    // 获取这些菜单项的树形结构
    const menus = await this.menuTreeRepository.findTrees() || [];

    // 过滤掉用户没有权限的菜单项
    const filterMenus = (menus: Menu[]): Menu[] => {
      return menus
        ?.filter(menu => menuIds?.includes(menu.id))
        .map(menu => ({
          ...menu,
          children: filterMenus(menu.children || [])
        }));
    };
    return filterMenus(menus);
  }


  async allMenu() {
    // 获取这些菜单项的树形结构
    const menus = await this.menuTreeRepository.findTrees() || [];
    return menus;
  }

  /**
   * 获取扁平化菜单
   */
  async flatMenu(userInfo) {
    // 角色下有哪些菜单
    try {
      const roles = await this.roleRepository.findOne({
        where: {
          name: In(userInfo.roles)
        },
        relations: ['menus']
      })
      if (!roles) {
        return []
      }
      const menuIds = roles?.menus.map(menu => menu.id);
      const allMenu = await this.menuRepository.find();
      allMenu.forEach((menu, index) => {
        if (!menuIds.includes(menu.id)) {
          allMenu.splice(index, 1)
        }
      })
      return allMenu
    } catch (error) {
      throw new BussException('查询失败')
    }
  }


  /**
   * 分配菜单
   */
  async allocationMenu(allocationMenuDto: AllocationMenuDto) {
    const { roleId, menuIds } = allocationMenuDto
    if (roleId == 1) {
      throw new BussException('初始化账号禁止操作')
    }
    try {
      await this.roleRepository.manager.transaction(async (transactionalEntityManager) => {
        const role = await this.roleRepository.findOne({
          where: {
            id: roleId
          }
        })
        let menus = await this.menuRepository.findByIds(menuIds);
        role.menus = menus
        await transactionalEntityManager.save(role);
      })
      return "分配菜单成功";
    } catch (error) {
      throw new BussException("分配菜单失败");
    }
  }


  // 菜单列表
  async menuByNum(menuByNumDto: MenuByNumDto) {
    // 有条件的情况下
    if (menuByNumDto.name) {
      const filterMenus = (menus, name) => {
        return menus
          .map(menu => {
            const filteredChildren = filterMenus(menu.children || [], name);
            const shouldInclude = menu.name.includes(name) || filteredChildren.length > 0;

            return shouldInclude ? {
              ...menu,
              children: filteredChildren.length > 0 ? filteredChildren : null
            } : null;
          })
          .filter(menu => menu !== null); // 过滤掉 null
      };
      const allMenus = await this.menuTreeRepository.findTrees() || [];
      return filterMenus(allMenus, menuByNumDto.name);
    } else {

      const menus = await this.menuTreeRepository.findTrees() || [];
      const processMenus = (menus) => {
        return menus.map(menu => {
          // 递归处理 children，如果 children 是空数组则设置为 null
          const processedChildren = menu.children && menu.children.length > 0
            ? processMenus(menu.children)
            : null;

          return {
            ...menu,
            children: processedChildren
          };
        });
      };

      const processedMenus = processMenus(menus);
      return processedMenus;
    }
  }


  // 删除菜单
  async delMenu(delMenuDto) {
    if (!delMenuDto.id) {
      throw new BussException('请输入有效的菜单ID');
    }
    // 判断是否有下级菜单
    const data = await this.menuRepository.findOne({
      where: {
        parent: {
          id: delMenuDto.id
        }
      }
    })
    if (data) {
      throw new BussException('该菜单下存在子菜单，无法进行删除')
    }

    try {
      await this.menuRepository.delete(delMenuDto.id);
    } catch (error) {
      throw new BussException('删除失败');
    }
  }

}
