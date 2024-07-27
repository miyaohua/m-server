import { Inject, Injectable } from '@nestjs/common';
import { RegistryDto } from './dto/registry.dto'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Like, Repository } from 'typeorm';
import { BussException } from 'src/common/exception/buss.exception';
import { EmailService } from 'src/email/email.service';
import { getRegistrySendEmail } from './constant/registrySendEmail';
import { RedisService } from 'src/redis/redis.service';
import { hash, verify } from 'argon2';
import { LoginDto } from './dto/login.dto';
import * as svgCaptcha from 'svg-captcha';
import { v1 } from 'uuid'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Role } from 'src/role/entities/role.entity';
import { Permission } from 'src/permission/entities/permission.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { PermissionGroup } from 'src/permission/entities/permissionGroup.entity';
import { DelUserDto } from './dto/delUser.dto';
import { ChangeUserStatusDto } from './dto/changeUserStatus.dto';
import { addUserDto } from './dto/addUser.dto'
import { EditUserDto } from './dto/editUser.dto';


@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>

  @Inject(EmailService)
  private readonly emailService: EmailService

  @Inject(RedisService)
  private readonly redisService: RedisService

  @Inject(JwtService)
  private readonly jwtService: JwtService

  @Inject(ConfigService)
  private readonly configService: ConfigService


  /**
   * 注册用户
   * @param registryDto 
   * @returns 
   */
  async registry(registryDto: RegistryDto) {
    const existingEmail = await this.userRepository.findOne({ where: { email: registryDto.email } })
    if (existingEmail) {
      throw new BussException('当前邮箱已被注册')
    }
    const isCode = await this.redisService.get(`reg_code_${registryDto.email}`)

    if (!isCode) {
      throw new BussException('验证码错误')
    }

    if (isCode !== registryDto.code) {
      throw new BussException('验证码错误')
    }

    const newUser = new User();
    newUser.username = registryDto.username;
    newUser.email = registryDto.email;
    newUser.password = await hash(registryDto.password);

    try {
      const savedUser = await this.userRepository.save(newUser)
      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      throw new BussException('注册失败，请稍后重试')
    }
  }

  /**
   * 注册发送验证码
   * @param registrySendEmailDto 
   * @returns 
   */
  async registrySendEmail(registrySendEmailDto) {
    const existingEmail = await this.userRepository.findOne({ where: { email: registrySendEmailDto.email } })
    if (existingEmail) {
      throw new BussException('当前邮箱已被注册')
    }
    let code = Math.random().toString().slice(2, 8);
    let html = getRegistrySendEmail(code);
    const ttl = await this.redisService.getTtl(`reg_code_${registrySendEmailDto.email}`)

    if (ttl !== -2 && ttl > 250) {
      throw new BussException('发送频繁，请稍后再试')
    }

    let sendStatus = await this.emailService.sendMail(
      {
        name: '用户注册',
        to: registrySendEmailDto.email,
        subject: '注册验证码',
        html
      }
    )
    if (sendStatus == '发送成功') {
      // redis存状态
      await this.redisService.set(`reg_code_${registrySendEmailDto.email}`, code, 300)
      return '验证码发送成功'
    } else {
      throw new BussException('发送失败')
    }
  }

  /**
   * 获取登录验证码
   */
  async getPicCode() {
    const captcha = svgCaptcha.create({
      size: 4,//生成几个验证码
      fontSize: 40, //文字大小
      width: 90,  //宽度
      height: 32,  //高度
      color: true,
      background: '#6597AE',  //背景颜色
    })
    let randomId = v1()
    await this.redisService.set(`captcha_${randomId}`, captcha.text, 300)

    return {
      uuid: randomId,
      img: captcha.data
    }
  }

  /**
   * 用户登录
   * @param loginDto 
   */
  async login(loginDto: LoginDto) {
    const { email, password, code, uuid } = loginDto

    const isUUID = await this.redisService.get(`captcha_${uuid}`)

    if (!isUUID) {
      throw new BussException('验证码错误')
    }
    if (isUUID.toString().toLocaleLowerCase() !== code.toString().toLocaleLowerCase()) {
      throw new BussException('验证码错误')
    }
    // 当前用户
    const currentUser = await this.userRepository.findOne({
      where: {
        email
      },
      relations: ['roles', 'roles.permissionGroups', 'roles.permissionGroups.permissions']
    })
    if (!currentUser) {
      throw new BussException('当前用户未注册')
    }
    const isPass = await verify(currentUser.password, password)

    if (!isPass) {
      throw new BussException('密码错误')
    }

    if (!currentUser.status) {
      throw new BussException('该账户已被冻结，请联系管理员')
    }
    // 获取当前用户的角色和权限
    const roles = currentUser.roles.map(v => v.name)

    const permissionGroups = currentUser.roles.flatMap(role => role.permissionGroups);

    // 获取到权限标识
    const permissions = permissionGroups.flatMap(group => group.permissions)
      .map(permission => permission.identifying)
      .filter((value, index, self) => self.indexOf(value) === index);

    // 生成本次验证token
    const token = this.jwtService.sign(
      {
        userId: currentUser.id,
        email: currentUser.email,
        username: currentUser.username,
        roles,
        permissions
      },
      {
        expiresIn: this.configService.get('jwt_expiresIn') || '30m'
      })
    // 重置token
    const refreshToken = this.jwtService.sign(
      {
        userId: currentUser.id,
      },
      {
        expiresIn: '7d'
      }
    )
    // 剔除一些不需要返回的状态
    const { password: discardPassword, status: discardStatus, ...userInfo } = currentUser
    return {
      token,
      refreshToken,
      userInfo
    }
  }

  /**
   * 分页查询用户
   */
  async getAllUser(getAllUser) {
    const { email, status, pageSize, pageNum } = getAllUser
    let newStatus = status == '1' ? true : false
    const queryConditions = {
      ...(email && { email: Like(`%${email}%`) }),
      ...(status && { status: newStatus })
    };
    const [result, total] = await this.userRepository.findAndCount({
      where: queryConditions,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      relations: ['roles']
    })

    return {
      list: result,
      total
    }
  }


  /**
   * 删除用户
   * @param delUserDto 
   */
  async delUser(delUserDto: DelUserDto) {
    if (!delUserDto.ids.length) {
      throw new BussException('请输入要删除的用户id')
    }
    try {
      await this.userRepository.delete(delUserDto.ids)
      return '删除成功'
    } catch (error) {
      throw new BussException('删除失败')
    }
  }

  /**
   * 修改用户状态
   * @param changeUserStatusDto 
   */
  async changeUserStatus(changeUserStatusDto: ChangeUserStatusDto) {
    try {
      await this.userRepository.update(changeUserStatusDto.id, { status: changeUserStatusDto.status })
      return '修改成功'
    } catch (error) {
      throw new BussException('修改失败')
    }
  }


  /**
   * 新增用户
   * @param addUserDto 
   */
  async addUser(addUserDto: addUserDto) {
    const existingEmail = await this.userRepository.findOne({ where: { email: addUserDto.email } })
    if (existingEmail) {
      throw new BussException('当前邮箱已被注册')
    }
    const newUser = new User();
    newUser.username = addUserDto.username;
    newUser.email = addUserDto.email;
    newUser.password = await hash(addUserDto.password);
    try {
      const savedUser = await this.userRepository.save(newUser)
      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      throw new BussException('新增失败')
    }
  }


  /**
   * 修改用户
   * @param editUserDto 
   */
  async editUser(editUserDto: EditUserDto) {
    // 如果提供了密码，则进行验证和哈希处理
    if (editUserDto.password) {
      console.log(editUserDto.password);

      const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^a-zA-Z0-9]+$).{6,20}$/;
      const flag = reg.test(editUserDto.password);
      if (!flag) {
        throw new BussException('请输入6-20位字符，（字母、数字、特殊字符）至少包含两种字符类型');
      }
      editUserDto.password = await hash(editUserDto.password);
    }

    await this.userRepository.manager.transaction(async (transactionalEntityManager) => {
      const userRepository = transactionalEntityManager.getRepository(User);
      const roleRepository = transactionalEntityManager.getRepository(Role);
      // 更新用户信息
      let updateObj: any = {
        username: editUserDto.username,
        email: editUserDto.email,
      };
      if (editUserDto.password) {
        updateObj.password = editUserDto.password;
      }
      await userRepository.update(editUserDto.id, updateObj);
      // 批量更新角色
      if (editUserDto.roles && editUserDto.roles.length) {
        const user = await userRepository.findOne({ where: { id: editUserDto.id }, relations: ['roles'] });
        if (!user) {
          throw new BussException('用户不存在');
        }
        // 清空现有的角色
        user.roles = [];
        // 添加新角色
        for (const roleId of editUserDto.roles) {
          const role = await roleRepository.findOne({ where: { id: roleId } });
          if (!role) {
            throw new BussException(`角色ID ${roleId} 不存在`);
          }
          user.roles.push(role);
        }
        await userRepository.save(user);
      } else {
        const user = await userRepository.findOne({ where: { id: editUserDto.id }, relations: ['roles'] });
        if (!user) {
          throw new BussException('用户不存在');
        }
        // 清空现有的角色
        user.roles = [];
        await userRepository.save(user);
      }
    });

    return '修改成功';
  }



  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>

  @InjectRepository(Permission)
  private readonly permissionRepository: Repository<Permission>

  @InjectRepository(PermissionGroup)
  private readonly PermissionGroupRepository: Repository<PermissionGroup>

  @InjectRepository(Menu)
  private readonly menuyRepository: Repository<Menu>

  async runData() {
    enum MenuType {
      C = "C",
      M = "M"
    }

    let menuType: MenuType;

    let menu1 = new Menu();
    menu1.name = '系统管理'
    menu1.path = '/systen'
    menu1.menuType = MenuType.M;
    menu1.menuIcon = 'AppstoreOutlined'
    await this.menuyRepository.save(menu1)

    let menu4 = new Menu();
    menu4.name = '用户管理'
    menu4.path = '/systen/user'
    menu4.component = 'user'
    menu4.menuType = MenuType.C
    menu4.menuIcon = 'UserOutlined'
    menu4.parent = menu1
    await this.menuyRepository.save(menu4)


    let menu2 = new Menu();
    menu2.name = '角色管理'
    menu2.path = '/systen/role'
    menu2.component = 'role'
    menu2.menuType = MenuType.C
    menu2.menuIcon = 'TeamOutlined'
    menu2.parent = menu1
    await this.menuyRepository.save(menu2)

    let menu3 = new Menu();
    menu3.name = '菜单管理'
    menu3.path = '/systen/menu'
    menu3.component = 'menu'
    menu3.menuType = MenuType.C
    menu3.menuIcon = 'MenuOutlined'
    menu3.parent = menu1
    await this.menuyRepository.save(menu3)

    // 菜单权限
    let permission1 = new Permission()
    permission1.identifying = 'create-menu';
    permission1.name = '新增菜单'
    permission1.desc = '用户拥有新增菜单权限'
    await this.permissionRepository.save(permission1)

    let permission2 = new Permission()
    permission2.identifying = 'update-menu';
    permission2.name = '更新菜单'
    permission2.desc = '用户拥有更新菜单权限'
    await this.permissionRepository.save(permission2)

    let permission3 = new Permission()
    permission3.identifying = 'delete-menu';
    permission3.name = '删除菜单'
    permission3.desc = '用户拥有删除菜单权限'
    await this.permissionRepository.save(permission3)

    let permission4 = new Permission()
    permission4.identifying = 'query-menu';
    permission4.name = '查询菜单'
    permission4.desc = '用户拥有查询菜单权限'
    await this.permissionRepository.save(permission4)

    let permissionGroup1 = new PermissionGroup()
    permissionGroup1.name = '菜单权限'
    permissionGroup1.permissions = [permission1, permission2, permission3, permission4]
    await this.PermissionGroupRepository.save(permissionGroup1)


    // 用户权限
    let permission5 = new Permission()
    permission5.identifying = 'create-user';
    permission5.name = '新增用户'
    permission5.desc = '用户拥有新增用户权限'
    await this.permissionRepository.save(permission5)

    let permission6 = new Permission()
    permission6.identifying = 'update-user';
    permission6.name = '更新用户'
    permission6.desc = '用户拥有更新用户权限'
    await this.permissionRepository.save(permission6)

    let permission7 = new Permission()
    permission7.identifying = 'delete-user';
    permission7.name = '删除用户'
    permission7.desc = '用户拥有删除用户权限'
    await this.permissionRepository.save(permission7)

    let permission8 = new Permission()
    permission8.identifying = 'query-user';
    permission8.name = '查询用户'
    permission8.desc = '用户拥有查询用户权限'
    await this.permissionRepository.save(permission8)

    let permissionGroup2 = new PermissionGroup()
    permissionGroup2.name = '用户权限'
    permissionGroup2.permissions = [permission5, permission6, permission7, permission8]
    await this.PermissionGroupRepository.save(permissionGroup2)





    // 角色权限
    let permission10 = new Permission()
    permission10.identifying = 'create-role';
    permission10.name = '新增角色'
    permission10.desc = '用户拥有新增角色权限'
    await this.permissionRepository.save(permission10)

    let permission11 = new Permission()
    permission11.identifying = 'update-role';
    permission11.name = '更新角色'
    permission11.desc = '用户拥有更新角色权限'
    await this.permissionRepository.save(permission11)

    let permission12 = new Permission()
    permission12.identifying = 'delete-role';
    permission12.name = '删除角色'
    permission12.desc = '用户拥有删除角色权限'
    await this.permissionRepository.save(permission12)

    let permission13 = new Permission()
    permission13.identifying = 'query-role';
    permission13.name = '查询角色'
    permission13.desc = '用户拥有查询角色权限'
    await this.permissionRepository.save(permission13)

    let permissionGroup3 = new PermissionGroup()
    permissionGroup3.name = '角色权限'
    permissionGroup3.permissions = [permission10, permission11, permission12, permission13]
    await this.PermissionGroupRepository.save(permissionGroup3)




    let role = new Role()
    role.name = '超级管理员'
    role.desc = '拥有网站的最高控制权'
    role.permissionGroups = [permissionGroup1, permissionGroup2, permissionGroup3]
    role.menus = [menu1, menu2, menu3, menu4]
    await this.roleRepository.save(role)


    let user = new User();
    user.email = '2542571191@qq.com'
    user.password = await hash('mi010409')
    user.username = '米耀华'
    user.roles = [role]
    await this.userRepository.save(user)

    for (let i = 0; i < 20; i++) {
      let user = new User()
      user.email = `${i}@qq.com`
      user.password = await hash('mi010409')
      user.username = `米耀华${i}`
      await this.userRepository.save(user)
    }
  }
}
