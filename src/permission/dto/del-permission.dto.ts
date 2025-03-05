import { IsNotEmpty } from "class-validator";

export class DelPermissionDto {
    @IsNotEmpty({ message: "权限id必填" })
    id: string;
}