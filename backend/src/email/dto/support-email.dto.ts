import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SupportEmailDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A mensagem não pode estar vazia' })
  message: string;
}
