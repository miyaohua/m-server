import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";

// 权限分组表
@Entity()
export class PermissionGroup {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ comment: '权限分组名称' })
    name: string

    @OneToMany(() => Permission, (permission) => permission.permissionGroup)
    permissions: Permission[]
}