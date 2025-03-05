import { IsNotEmpty } from "class-validator";

export class UpdatePermissionDto {
    
    @IsNotEmpty({ message: "权限id必填" })
    id: string;

    @IsNotEmpty({ message: "权限名称必填" })
    name: string;

    @IsNotEmpty({ message: "权限描述必填" })
    desc: string

    @IsNotEmpty({ message: "权限标识必填" })
    identifying: string
}