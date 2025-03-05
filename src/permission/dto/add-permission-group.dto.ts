import { IsNotEmpty } from "class-validator";

export class AddPermissionGroupDto {
    @IsNotEmpty({ message: "权限组名称必填" })
    permissionGroupName: string;
}