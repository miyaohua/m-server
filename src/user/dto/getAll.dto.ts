import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class GetAllDto {
    @IsOptional()
    @IsString()
    email: string

    @IsOptional()
    status: string


    @IsString()
    @IsNotEmpty({ message: '请输入pageSize' })
    pageSize: string

    @IsString()
    @IsNotEmpty({ message: '请输入pageNum' })
    pageNum: string
}