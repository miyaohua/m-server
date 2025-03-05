import { IsNotEmpty } from "class-validator";


export class AllocationMenuDto {
    @IsNotEmpty({ message: '请输入角色id' })
    roleId: number

    @IsNotEmpty({ message: '请输入分配的菜单id' })
    menuIds: number[]
}