import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CriarAgendamentoDto {
  @ApiProperty({ description: 'ID do cliente', example: 'uuid-do-cliente' })
  @IsUUID('4', { message: 'ID do cliente inválido' })
  clienteId: string;

  @ApiProperty({ description: 'ID do barbeiro', example: 'uuid-do-barbeiro' })
  @IsUUID('4', { message: 'ID do barbeiro inválido' })
  barbeiroId: string;

  @ApiProperty({ description: 'Data e hora do agendamento (ISO 8601)', example: '2026-07-01T14:00:00Z' })
  @IsDateString({}, { message: 'Data/hora inválida. Use formato ISO 8601' })
  dataHora: string;

  @ApiProperty({ description: 'Serviço a ser realizado', example: 'Corte + Barba' })
  @IsString()
  @IsNotEmpty({ message: 'O serviço é obrigatório' })
  servico: string;

  @ApiPropertyOptional({ description: 'Observações adicionais', example: 'Prefere máquina 2' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
