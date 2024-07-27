import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class GetAllRoleDto {
    @IsOptional()
    @IsString()
    name: string

    @IsNumber()
    @IsNotEmpty({ message: '请输入pageSize' })
    pageSize: number

    @IsNumber()
    @IsNotEmpty({ message: '请输入pageNum' })
    pageNum: number
}