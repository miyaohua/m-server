import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Permission } from "./entities/permission.entity";
import { PermissionGroup } from "./entities/permissionGroup.entity";
import { DistributionDto } from "./dto/Distribution.dto";
import { Role } from "../role/entities/role.entity";
import { BussException } from "../common/exception/buss.exception";

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


  async distributionPermission(distributionDto: DistributionDto) {
    const { roleId, permissions } = distributionDto;
    if (+roleId == 1) {
      throw new BussException('初始化账号禁止操作')
    }
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
}
