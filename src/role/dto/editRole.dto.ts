import { IsNotEmpty } from "class-validator";

export class EditRoleDto {
  @IsNotEmpty({ message: "请输入要修改的角色id" })
  id: string;

  @IsNotEmpty({ message: "请输入要修改的角色名称" })
  name: string;

  @IsNotEmpty({ message: "请输入要修改的角色描述" })
  desc: string;
}