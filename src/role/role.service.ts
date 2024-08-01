import { Injectable } from '@nestjs/common';
import { GetAllRoleDto } from './dto/getAllRole.dto';
import { Like } from 'typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { DeleteDto } from './dto/deleteRole.dto'
import { BussException } from 'src/common/exception/buss.exception';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>


  async getAllRole(getAllRoleDto: GetAllRoleDto) {
    const { name, pageSize, pageNum } = getAllRoleDto
    const queryConditions = {
      ...(name && { name: Like(`%${name}%`) }),
    };
    const [result, total] = await this.roleRepository.findAndCount({
      where: queryConditions,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      relations: ['permissionGroups', 'permissionGroups.permissions']
    })

    return {
      list: result,
      total
    }
  }


  async getRole() {
    console.log(await this.roleRepository.find())
    return await this.roleRepository.find()
  }

  /**
   * 批量删除角色
   * @param deleteDto 
   * @returns 
   */
  async delete(deleteDto: DeleteDto) {
    console.log(deleteDto.ids);
    if (!deleteDto.ids.length) {
      throw new BussException('请输入要删除的角色id')
    }

    if (deleteDto.ids.includes(1)) {
      throw new BussException('初始化账号禁止删除')
    }
    try {
      await this.roleRepository.delete(deleteDto.ids)
      return '删除成功'
    } catch (error) {
      throw new BussException('删除失败')
    }
  }

}
