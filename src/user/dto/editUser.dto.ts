import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator"
import { passReg } from "src/utils/reg"

export class EditUserDto {
    @IsNotEmpty({ message: '请输入修改的用户id' })
    id: number

    @IsString()
    @IsOptional()
    username: string

    @IsOptional()
    password: string

    @IsEmail({}, { message: '请输入合法的邮箱' })
    @IsNotEmpty({ message: '请输入邮箱' })
    email: string
}