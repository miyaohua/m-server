import { IsNotEmpty } from "class-validator";

export class UpdatePermissionGroupDto {
    @IsNotEmpty({ message: "权限组id必填" })
    id: string;

    @IsNotEmpty({ message: '权限组名称必填' })
    name: string
}