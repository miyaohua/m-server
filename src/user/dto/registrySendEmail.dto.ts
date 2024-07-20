import { IsEmail, IsNotEmpty } from "class-validator";

export class RegistrySendEmailDto {
    @IsEmail({}, { message: '请输入合法的邮箱' })
    @IsNotEmpty({ message: '请输入邮箱' })
    email: string
}