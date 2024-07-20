import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, UpdateDateColumn } from "typeorm";

/**
 * 菜单类型
 * C 菜单
 * M 目录
 */
enum MenuType {
    C = "C",
    M = "M"
}

@Entity()
@Tree("closure-table")
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '菜单名称' })
    name: string

    @Column({ comment: '菜单路径', unique: true })
    path: string

    @Column({ comment: '菜单是否隐藏', default: false })
    isHidden: boolean

    @Column({ comment: '前端组件', default: null })
    component: string | null

    @Column({ comment: '是否为iframe', default: false })
    isIframe: boolean

    @Column({ comment: '菜单类型' })
    menuType: MenuType

    @Column({ comment: '菜单icon图标' })
    menuIcon: string

    @TreeChildren()
    children: Menu[];

    @TreeParent()
    parent: Menu;

    @CreateDateColumn({ comment: '创建日期' })
    created_at: Date

    @UpdateDateColumn({ comment: '更新日期' })
    updated_at: Date
}
