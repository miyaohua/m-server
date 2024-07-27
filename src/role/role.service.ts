import { Injectable } from '@nestjs/common';
import { GetAllRoleDto } from './dto/getAllRole.dto';
import { Like } from 'typeorm';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

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
      relations: ['permissionGroup', 'permissionGroup.permission']
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

}
