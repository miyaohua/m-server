
import { IsNotEmpty } from 'class-validator'

export class DeleteDto {
    @IsNotEmpty()
    ids: number[]
}