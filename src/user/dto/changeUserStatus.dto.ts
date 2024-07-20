import { IsNotEmpty } from "class-validator";

export class ChangeUserStatusDto {
    @IsNotEmpty({ message: '请传入要修改的用户' })
    id: number

    @IsNotEmpty({ message: '请传入要修改的用户状态' })
    status: boolean
}