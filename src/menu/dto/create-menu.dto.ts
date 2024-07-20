import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
enum MenuType {
    C = "C",
    M = "M"
}

export class CreateMenuDto {
    @IsNotEmpty({ message: '请输入菜单名称' })
    name: string

    @IsNotEmpty({ message: '请输入菜单路径' })
    path: string

    @IsNotEmpty({ message: '请选择菜单是否隐藏' })
    isHidden: boolean

    @IsString()
    @IsOptional()
    component: string | null

    @IsNotEmpty({ message: '请选择是否为iframe' })
    isIframe: boolean

    @IsNotEmpty({ message: '请选择菜单类型' })
    @IsEnum(MenuType, { message: '请输入有效的菜单类型' })
    menuType: MenuType

    @IsNumber()
    @IsOptional()
    parentId?: number | null

    @IsString()
    menuIcon: string
}
