import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "src/role/entities/role.entity";

// 用户表
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ comment: '用户名称', default: null })
    username: string | null

    @Column({ comment: '用户邮箱', unique: true })
    email: string

    @Column({ comment: '用户密码' })
    password: string

    @Column({ comment: '用户状态', default: true })
    status: boolean

    @CreateDateColumn({ comment: '创建日期' })
    created_at: Date

    @UpdateDateColumn({ comment: '更新日期' })
    updated_at: Date

    // 定义多对多关系
    @ManyToMany(() => Role)
    @JoinTable({
        name: 'user_role'
    })
    roles: Role[]
}
