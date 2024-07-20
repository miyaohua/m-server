import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PermissionGroup } from "./permissionGroup.entity";

// 权限表
@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ comment: '权限标识' })
    identifying: string

    @Column({ comment: '权限中文名' })
    name: string

    @Column({ comment: '权限描述' })
    desc: string

    @ManyToOne(() => PermissionGroup, permissionGroup => permissionGroup.permissions)
    permissionGroup: PermissionGroup;
}