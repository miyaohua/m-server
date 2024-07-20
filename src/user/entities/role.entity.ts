import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";
import { Menu } from "src/menu/entities/menu.entity";
import { PermissionGroup } from "./permissionGroup.entity";
// 角色表
@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ comment: '角色名称' })
    name: string

    @Column({ comment: '角色描述' })
    desc: string

    // 定义多对多关系
    @ManyToMany(() => PermissionGroup)
    @JoinTable({
        name: 'role_permissionGroup'
    })
    permissionGroups: PermissionGroup[]


    @ManyToMany(() => Menu)
    @JoinTable({
        name: 'role_menu'
    })
    menus: Menu[]
}