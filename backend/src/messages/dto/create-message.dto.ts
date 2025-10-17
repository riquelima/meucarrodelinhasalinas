import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: 'ID de quem enviou a mensagem' })
  @IsString()
  senderId: string;

  @ApiProperty({ description: 'ID de quem recebeu a mensagem' })
  @IsString()
  receiverId: string;

  @ApiProperty({ description: 'Conteúdo de texto da mensagem', required: false })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ description: 'URL da imagem armazenada na Cloudinary', required: false })
  @IsOptional()
  @IsString()
  image?: string;
}
