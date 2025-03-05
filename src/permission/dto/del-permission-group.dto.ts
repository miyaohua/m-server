import { IsNotEmpty } from "class-validator";

export class DelPermissionGroupDto {
    @IsNotEmpty({ message: "权限组id必填" })
    id: string;
}