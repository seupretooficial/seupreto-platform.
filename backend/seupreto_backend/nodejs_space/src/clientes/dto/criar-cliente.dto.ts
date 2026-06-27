import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CriarClienteDto {
  @ApiProperty({ description: 'Nome completo do cliente', example: 'Maria Souza' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiProperty({ description: 'E-mail do cliente', example: 'maria@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ description: 'Senha (mínimo 6 caracteres)', example: 'senha123' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @ApiPropertyOptional({ description: 'Telefone do cliente', example: '(11) 98888-7777' })
  @IsOptional()
  @IsString()
  telefone?: string;
}
