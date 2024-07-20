import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { passReg } from "src/utils/reg";


export class addUserDto {
    @IsString()
    @IsOptional()
    username: string

    @Matches(passReg, {
        message: '请输入6-20位字符,(字母、‌数字、‌特殊字符)至少包含两种字符类型',
    })
    @IsNotEmpty({ message: '请输入密码' })
    password: string

    @IsEmail({}, { message: '请输入合法的邮箱' })
    @IsNotEmpty({ message: '请输入邮箱' })
    email: string
}