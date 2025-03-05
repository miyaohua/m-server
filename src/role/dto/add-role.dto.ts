
import { IsNotEmpty } from 'class-validator'

export class AddRoleDto {
  @IsNotEmpty()
  name:string;

  @IsNotEmpty()
  desc:string;
}