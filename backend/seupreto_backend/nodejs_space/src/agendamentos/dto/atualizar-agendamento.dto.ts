import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { StatusAgendamento } from '@prisma/client';

export class AtualizarAgendamentoDto {
  @ApiPropertyOptional({ description: 'ID do barbeiro', example: 'uuid-do-barbeiro' })
  @IsOptional()
  @IsUUID('4', { message: 'ID do barbeiro inválido' })
  barbeiroId?: string;

  @ApiPropertyOptional({ description: 'Nova data e hora (ISO 8601)', example: '2026-07-01T15:00:00Z' })
  @IsOptional()
  @IsDateString({}, { message: 'Data/hora inválida' })
  dataHora?: string;

  @ApiPropertyOptional({ description: 'Serviço', example: 'Corte Degradê' })
  @IsOptional()
  @IsString()
  servico?: string;

  @ApiPropertyOptional({ description: 'Status do agendamento', enum: StatusAgendamento })
  @IsOptional()
  @IsEnum(StatusAgendamento, { message: 'Status inválido. Use: PENDENTE, CONFIRMADO, CONCLUIDO ou CANCELADO' })
  status?: StatusAgendamento;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
