import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { StatusAgendamento } from '@prisma/client';

export class FiltroAgendamentoDto {
  @ApiPropertyOptional({ description: 'Filtrar por data inicial (ISO 8601)', example: '2026-07-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({ description: 'Filtrar por data final (ISO 8601)', example: '2026-07-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({ description: 'Filtrar por barbeiro' })
  @IsOptional()
  @IsUUID('4')
  barbeiroId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por cliente' })
  @IsOptional()
  @IsUUID('4')
  clienteId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por status', enum: StatusAgendamento })
  @IsOptional()
  @IsEnum(StatusAgendamento)
  status?: StatusAgendamento;
}
