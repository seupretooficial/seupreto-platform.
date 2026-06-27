import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class RegistroDto {
  @ApiProperty({ description: 'Nome completo do usuário', example: 'João Silva' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiProperty({ description: 'E-mail do usuário', example: 'joao@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ description: 'Senha (mínimo 6 caracteres)', example: 'senha123' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @ApiPropertyOptional({ description: 'Tipo de usuário', enum: Role, default: Role.CLIENTE })
  @IsOptional()
  @IsEnum(Role, { message: 'Role inválida. Use: CLIENTE, BARBEIRO ou ADMIN' })
  role?: Role;

  @ApiPropertyOptional({ description: 'Telefone do usuário', example: '(11) 99999-1234' })
  @IsOptional()
  @IsString()
  telefone?: string;
}
