import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Menu } from "src/menu/entities/menu.entity";
import { PermissionGroup } from "src/permission/entities/permissionGroup.entity";
// 角色表
@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ comment: '角色名称' })
    name: string

    @Column({ comment: '角色描述' })
    desc: string

    @CreateDateColumn({ comment: '创建日期' })
    created_at: Date

    @UpdateDateColumn({ comment: '更新日期' })
    updated_at: Date


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