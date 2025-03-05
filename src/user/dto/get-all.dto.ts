import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class GetAllDto {
    @IsOptional()
    @IsString()
    email: string

    @IsOptional()
    status: string


    @IsNumber()
    @IsNotEmpty({ message: '请输入pageSize' })
    pageSize: number

    @IsNumber()
    @IsNotEmpty({ message: '请输入pageNum' })
    pageNum: number
}