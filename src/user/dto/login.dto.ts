import { IsEmail, IsNotEmpty, Matches } from "class-validator";
import { passReg } from "src/utils/reg";
export class LoginDto {

    @IsEmail({}, { message: '请输入合法的邮箱' })
    @IsNotEmpty({ message: '请输入邮箱' })
    email: string


    @Matches(passReg, {
        message: '请输入6-20位字符,(字母、‌数字、‌特殊字符)至少包含两种字符类型',
    })
    @IsNotEmpty({ message: '请输入密码' })
    password: string

    @IsNotEmpty({ message: '请输入图片验证码' })
    code: string

    @IsNotEmpty({ message: '请输入图片验证码' })
    uuid: string
}