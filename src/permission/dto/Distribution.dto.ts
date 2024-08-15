import { IsNotEmpty } from "class-validator";

export class DistributionDto {
  @IsNotEmpty({ message: "请输入角色id" })
  roleId: string;

  @IsNotEmpty({ message: "请输入修改的权限" })
  permissions: any[];
}