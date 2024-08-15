import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permission } from "./permission.entity";
import { DateTransformer } from "../../common/transformer/dateTransformer";

// 权限分组表
@Entity()
export class PermissionGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: "权限分组名称" })
  name: string;

  @CreateDateColumn({ comment: "创建日期", transformer: new DateTransformer() })
  created_at: Date;

  @UpdateDateColumn({ comment: "更新日期", transformer: new DateTransformer() })
  updated_at: Date;

  @OneToMany(() => Permission, (permission) => permission.permissionGroup)
  permissions: Permission[];
}