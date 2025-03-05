import { IsNotEmpty } from "class-validator";

export class AddPermissionDto {
    @IsNotEmpty({ message: "权限分组必填" })
    permissionGroupId: string

    @IsNotEmpty({ message: "权限名称必填" })
    name: string;

    @IsNotEmpty({ message: "权限描述必填" })
    desc: string

    @IsNotEmpty({ message: "权限标识必填" })
    identifying: string
}