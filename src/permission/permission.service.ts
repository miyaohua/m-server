import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permission } from "./entities/permission.entity";
import { PermissionGroup } from "./entities/permissionGroup.entity";
import { DistributionDto } from "./dto/distribution-permission.dto";
import { Role } from "../role/entities/role.entity";
import { BussException } from "../common/exception/buss.exception";
import { AddPermissionGroupDto } from "./dto/add-permission-group.dto";
import { DelPermissionGroupDto } from "./dto/del-permission-group.dto";
import { UpdatePermissionGroupDto } from "./dto/update-permission-group.dto";
import { AddPermissionDto } from "./dto/add-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { DelPermissionDto } from "./dto/del-permission.dto";

@Injectable()
export class PermissionService {
  @InjectRepository(Permission)
  private readonly permissionRepository: Repository<Permission>;

  @InjectRepository(PermissionGroup)
  private readonly permissionGroupRepository: Repository<PermissionGroup>;

  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;


  /**
   * 获取所有权限
   */
  async getPermissions() {
    try {
      return await this.permissionGroupRepository.find({
        relations: ["permissions"]
      });
    } catch (error) {
      throw new BadRequestException("查询失败");
    }
  }

  /**
   * 为角色分配权限
   * @param distributionDto 
   * @returns 
   */
  async distributionPermission(distributionDto: DistributionDto) {
    const { roleId, permissions } = distributionDto;
    try {
      await this.roleRepository.manager.transaction(async (transactionalEntityManager) => {
        const role = await this.roleRepository.findOne({
          where: {
            id: +roleId
          }
        });
        role.permissions = permissions;
        await transactionalEntityManager.save(role);
      });
      return "分配权限成功";
    } catch (error) {
      throw new BussException("分配权限失败");
    }
  }


  /**
   * 新增权限组
   * @param addPermissionGroupDto 
   * @returns 
   */
  async addPermissionGroup(addPermissionGroupDto: AddPermissionGroupDto) {
    const permissionGroup = this.permissionGroupRepository.create({
      name: addPermissionGroupDto.permissionGroupName
    });
    return await this.permissionGroupRepository.save(permissionGroup);
  }


  /**
   * 删除权限组
   * @param delPermissionGroupDto 
   */
  async delPermissionGroup(delPermissionGroupDto: DelPermissionGroupDto) {
    const data = await this.permissionRepository.find({
      where: {
        permissionGroup: {
          id: +delPermissionGroupDto.id
        }
      }
    });
    if (data.length) {
      throw new BussException("该权限组下有权限，无法删除");
    }

    const isDel = await this.permissionGroupRepository.delete(delPermissionGroupDto.id);
    if (isDel.affected !== 1) {
      throw new BussException("删除失败");
    }
    return '删除成功'
  }

  /**
   * 更新权限组
   * @param updatePermissionGroupDto 
   */
  async updatePermissionGroup(updatePermissionGroupDto: UpdatePermissionGroupDto) {
    const { id, name } = updatePermissionGroupDto;
    const isUpdate = await this.permissionGroupRepository.update(id, {
      name
    });
    if (isUpdate.affected !== 1) {
      throw new BussException("更新失败")
    }
    return '更新成功'
  }


  /**
   * 新增权限
   * @param addPermission 
   */
  async addPermission(addPermission: AddPermissionDto) {
    const isUnique = await this.permissionRepository.findOne({
      where: {
        identifying: addPermission.identifying
      }
    })
    if (isUnique) {
      throw new BussException('标识已存在');
    }

    const permissionGroup = await this.permissionGroupRepository.findOne({
      where: { id: +addPermission.permissionGroupId }
    });
    if (!permissionGroup) {
      throw new BussException('指定的权限组不存在');
    }

    // 创建并关联权限组
    const permission = this.permissionRepository.create({
      ...addPermission,
      permissionGroup // 根据实体关系配置的属性名称
    });

    // 保存并返回带关联关系的结果
    return this.permissionRepository.save(permission);
  }


  /**
   * 更新权限
   * @param updatePermissionDto 
   */
  async updatePermission(updatePermissionDto: UpdatePermissionDto) {
    const isUnique = await this.permissionRepository.findOne({
      where: {
        identifying: updatePermissionDto.identifying
      }
    })
    if (isUnique && (isUnique.id !== +updatePermissionDto.id)) {
      throw new BussException('标识已存在');
    }

    const { id, name, desc, identifying } = updatePermissionDto;
    const isUpdate = await this.permissionRepository.update(id, {
      name,
      desc,
      identifying
    })
    if (isUpdate.affected !== 1) {
      throw new BussException("更新失败")
    }
    return '更新成功'
  }

  /**
   * 删除权限
   * @param delPermissionDto 
   */
  async delPermission(delPermissionDto: DelPermissionDto) {
    const isDel = await this.permissionRepository.delete(delPermissionDto.id)
    if (isDel.affected !== 1) {
      throw new BussException("删除失败");
    }
    return '删除成功'
  }
}
