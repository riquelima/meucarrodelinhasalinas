import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEmpty, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @ApiProperty({ example: '68f6d0b66050e3101206c2d6' })
    @IsString({ message: 'O id do avaliador informado é inválido' })
    @IsNotEmpty({ message: 'O id do avaliador não deve ser fornecido' })
    reviewerId: string;

    @ApiProperty({ example: '68f6cfd5fee4d0539b562b59' })
    @IsString({ message: 'O id do avaliado informado é inválido' })
    @IsNotEmpty({ message: 'O id do avaliado não deve ser fornecido' })
    receiverId: string;

    @ApiProperty({ example: 4, description: 'Avaliação dada ao motorista (1-5)' })
    @IsNotEmpty({ message: 'A avaliação é obrigatória' })
    @Min(1, { message: 'A avaliação mínima é 1' })
    @Max(5, { message: 'A avaliação máxima é 5' })
    rating: number;

    @ApiProperty({ example: 'Ótimo motorista, muito educado e pontual.', description: 'Comentário sobre o motorista' })
    @IsNotEmpty({ message: 'A mensagem é obrigatória' })
    content: string;
}
