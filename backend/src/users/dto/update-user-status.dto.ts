import { IsBoolean, IsString } from 'class-validator';

export class UpdateUserStatusDto {  
  @IsString()
  status: string;
}
