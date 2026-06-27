import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AtualizarClienteDto {
  @ApiPropertyOptional({ description: 'Nome completo', example: 'Maria Souza Silva' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'E-mail', example: 'maria.nova@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @ApiPropertyOptional({ description: 'Nova senha', example: 'novaSenha123' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha?: string;

  @ApiPropertyOptional({ description: 'Telefone', example: '(11) 97777-6666' })
  @IsOptional()
  @IsString()
  telefone?: string;
}
