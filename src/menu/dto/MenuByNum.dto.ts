import { IsOptional, IsString } from "class-validator";

export class MenuByNumDto {
    @IsString()
    @IsOptional()
    name: string
}