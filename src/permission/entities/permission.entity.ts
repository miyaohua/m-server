import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PermissionGroup } from "./permissionGroup.entity";
import { DateTransformer } from "../../common/transformer/dateTransformer";

// 权限表
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: "权限标识" })
  identifying: string;

  @Column({ comment: "权限中文名" })
  name: string;

  @Column({ comment: "权限描述" })
  desc: string;

  @CreateDateColumn({ comment: "创建日期", transformer: new DateTransformer() })
  created_at: Date;

  @UpdateDateColumn({ comment: "更新日期", transformer: new DateTransformer() })
  updated_at: Date;


  @ManyToOne(() => PermissionGroup, permissionGroup => permissionGroup.permissions)
  permissionGroup: PermissionGroup;
}