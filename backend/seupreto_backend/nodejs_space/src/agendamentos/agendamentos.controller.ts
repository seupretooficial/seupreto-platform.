import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AgendamentosService } from './agendamentos.service';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto';
import { AtualizarAgendamentoDto } from './dto/atualizar-agendamento.dto';
import { FiltroAgendamentoDto } from './dto/filtro-agendamento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Agendamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly agendamentosService: AgendamentosService) {}

  @Post()
  @Roles(Role.ADMIN, Role.BARBEIRO, Role.CLIENTE)
  @ApiOperation({ summary: 'Criar novo agendamento' })
  @ApiResponse({ status: 201, description: 'Agendamento criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Conflito de horário' })
  criar(@Body() dto: CriarAgendamentoDto) {
    return this.agendamentosService.criar(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.BARBEIRO)
  @ApiOperation({ summary: 'Listar agendamentos com filtros' })
  @ApiResponse({ status: 200, description: 'Lista de agendamentos' })
  listar(@Query() filtros: FiltroAgendamentoDto) {
    return this.agendamentosService.listar(filtros);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.BARBEIRO, Role.CLIENTE)
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do agendamento' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  buscarPorId(@Param('id') id: string) {
    return this.agendamentosService.buscarPorId(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento atualizado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  atualizar(@Param('id') id: string, @Body() dto: AtualizarAgendamentoDto) {
    return this.agendamentosService.atualizar(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.BARBEIRO, Role.CLIENTE)
  @ApiOperation({ summary: 'Cancelar agendamento' })
  @ApiResponse({ status: 200, description: 'Agendamento cancelado' })
  @ApiResponse({ status: 404, description: 'Agendamento não encontrado' })
  cancelar(@Param('id') id: string) {
    return this.agendamentosService.cancelar(id);
  }
}
