import { Injectable } from "@nestjs/common";
import { GetAllRoleDto } from "./dto/get-role.dto";
import { Like } from "typeorm";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";
import { DeleteDto } from "./dto/delete-role.dto";
import { BussException } from "../common/exception/buss.exception";
import { AddRoleDto } from "./dto/add-role.dto";
import { EditRoleDto } from "./dto/edit-role.dto";

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;

  /**
   * 分页获取角色
   */
  async getAllRole(getAllRoleDto: GetAllRoleDto) {
    const { name, pageSize, pageNum } = getAllRoleDto;
    const queryConditions = {
      ...(name && { name: Like(`%${name}%`) })
    };
    const [result, total] = await this.roleRepository.findAndCount({
      where: queryConditions,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      relations: ["menus", "permissions"]
    });

    return {
      list: result,
      total
    };
  }

  /**
   * 获取角色
   */
  async getRole() {
    return await this.roleRepository.find();
  }

  /**
   * 批量删除角色
   */
  async delete(deleteDto: DeleteDto) {
    if (!deleteDto.ids.length) {
      throw new BussException("请输入要删除的角色id");
    }
    try {
      await this.roleRepository.delete(deleteDto.ids);
      return "删除成功";
    } catch (error) {
      throw new BussException("删除失败");
    }
  }

  /**
   * 新增角色
   */
  async add(addRoleDto: AddRoleDto) {
    // 是否唯一
    const isUnique = await this.roleRepository.findOne({
      where: {
        name: addRoleDto.name
      }
    });
    if (isUnique) {
      throw new BussException("角色名称重复");
    }
    try {
      await this.roleRepository.save(addRoleDto);
      return "新增成功";
    } catch (error) {
      throw new BussException("新增角色失败");
    }
  }

  /**
   * 修改角色
   */
  async edit(editRoleDto: EditRoleDto) {
    // 是否唯一
    const isUnique = await this.roleRepository.findOne({
      where: {
        name: editRoleDto.name
      }
    });
    if (isUnique) {
      throw new BussException("角色名称重复");
    }
    try {
      await this.roleRepository.update(+editRoleDto.id, { name: editRoleDto.name, desc: editRoleDto.desc });
      return "修改成功";
    } catch (error) {
      throw new BussException("修改失败");
    }
  }

}
