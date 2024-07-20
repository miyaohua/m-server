import { IsNotEmpty } from "class-validator";

export class DelUserDto {
    @IsNotEmpty({ message: '请输入要删除的用户id' })
    ids: number[]
}