import { IsNotEmpty } from "class-validator";

export class DelMenuDto {
    @IsNotEmpty({ message: '请输入删除的菜单id' })
    id: string
}