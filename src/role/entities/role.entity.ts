import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Menu } from "src/menu/entities/menu.entity";
import { PermissionGroup } from "src/permission/entities/permissionGroup.entity";
import { Permission } from "../../permission/entities/permission.entity";
import { DateTransformer } from "../../common/transformer/dateTransformer";

// 角色表
@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: "角色名称", unique: true })
  name: string;

  @Column({ comment: "角色描述" })
  desc: string;

  @CreateDateColumn({ comment: "创建日期", transformer: new DateTransformer() })
  created_at: Date;

  @UpdateDateColumn({ comment: "更新日期", transformer: new DateTransformer() })
  updated_at: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: "role_permission"
  })
  permissions: Permission[];


  @ManyToMany(() => Menu)
  @JoinTable({
    name: "role_menu"
  })
  menus: Menu[];
}