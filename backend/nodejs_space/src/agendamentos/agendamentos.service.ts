import { Injectable, BadRequestException, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CriarAgendamentoDto } from './dto/criar-agendamento.dto';
import { AtualizarAgendamentoDto } from './dto/atualizar-agendamento.dto';
import { FiltroAgendamentoDto } from './dto/filtro-agendamento.dto';

@Injectable()
export class AgendamentosService {
  private readonly logger = new Logger(AgendamentosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CriarAgendamentoDto) {
    // Verificar se o cliente existe
    const cliente = await this.prisma.user.findFirst({ where: { id: dto.clienteId, role: 'CLIENTE' } });
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Verificar se o barbeiro existe
    const barbeiro = await this.prisma.user.findFirst({ where: { id: dto.barbeiroId, role: 'BARBEIRO' } });
    if (!barbeiro) {
      throw new NotFoundException('Barbeiro não encontrado');
    }

    const dataHora = new Date(dto.dataHora);
    if (dataHora <= new Date()) {
      throw new BadRequestException('A data do agendamento deve ser no futuro');
    }

    // Verificar disponibilidade do barbeiro (intervalo de 1 hora)
    const inicioIntervalo = new Date(dataHora.getTime() - 60 * 60 * 1000);
    const fimIntervalo = new Date(dataHora.getTime() + 60 * 60 * 1000);

    const conflito = await this.prisma.agendamento.findFirst({
      where: {
        barbeiroId: dto.barbeiroId,
        dataHora: { gte: inicioIntervalo, lte: fimIntervalo },
        status: { notIn: ['CANCELADO'] },
      },
    });

    if (conflito) {
      throw new ConflictException('O barbeiro já possui um agendamento neste horário');
    }

    const agendamento = await this.prisma.agendamento.create({
      data: {
        clienteId: dto.clienteId,
        barbeiroId: dto.barbeiroId,
        dataHora,
        servico: dto.servico,
        observacoes: dto.observacoes,
      },
      include: {
        cliente: { select: { id: true, nome: true, email: true } },
        barbeiro: { select: { id: true, nome: true } },
      },
    });

    this.logger.log(`Agendamento criado: ${agendamento.id}`);
    return agendamento;
  }

  async listar(filtros: FiltroAgendamentoDto) {
    const where: any = {};

    if (filtros.barbeiroId) where.barbeiroId = filtros.barbeiroId;
    if (filtros.clienteId) where.clienteId = filtros.clienteId;
    if (filtros.status) where.status = filtros.status;

    if (filtros.dataInicio || filtros.dataFim) {
      where.dataHora = {};
      if (filtros.dataInicio) where.dataHora.gte = new Date(filtros.dataInicio);
      if (filtros.dataFim) where.dataHora.lte = new Date(filtros.dataFim);
    }

    return this.prisma.agendamento.findMany({
      where,
      include: {
        cliente: { select: { id: true, nome: true, email: true, telefone: true } },
        barbeiro: { select: { id: true, nome: true } },
      },
      orderBy: { dataHora: 'asc' },
    });
  }

  async buscarPorId(id: string) {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id },
      include: {
        cliente: { select: { id: true, nome: true, email: true, telefone: true } },
        barbeiro: { select: { id: true, nome: true } },
      },
    });

    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }
    return agendamento;
  }

  async atualizar(id: string, dto: AtualizarAgendamentoDto) {
    const agendamento = await this.prisma.agendamento.findUnique({ where: { id } });
    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (agendamento.status === 'CANCELADO') {
      throw new BadRequestException('Não é possível editar um agendamento cancelado');
    }

    const data: any = { ...dto };

    if (dto.dataHora) {
      const novaData = new Date(dto.dataHora);
      if (novaData <= new Date()) {
        throw new BadRequestException('A data do agendamento deve ser no futuro');
      }

      const barbeiroIdCheck = dto.barbeiroId || agendamento.barbeiroId;
      const inicioIntervalo = new Date(novaData.getTime() - 60 * 60 * 1000);
      const fimIntervalo = new Date(novaData.getTime() + 60 * 60 * 1000);

      const conflito = await this.prisma.agendamento.findFirst({
        where: {
          id: { not: id },
          barbeiroId: barbeiroIdCheck,
          dataHora: { gte: inicioIntervalo, lte: fimIntervalo },
          status: { notIn: ['CANCELADO'] },
        },
      });

      if (conflito) {
        throw new ConflictException('O barbeiro já possui um agendamento neste horário');
      }

      data.dataHora = novaData;
    }

    const atualizado = await this.prisma.agendamento.update({
      where: { id },
      data,
      include: {
        cliente: { select: { id: true, nome: true, email: true } },
        barbeiro: { select: { id: true, nome: true } },
      },
    });

    this.logger.log(`Agendamento atualizado: ${id}`);
    return atualizado;
  }

  async cancelar(id: string) {
    const agendamento = await this.prisma.agendamento.findUnique({ where: { id } });
    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    if (agendamento.status === 'CANCELADO') {
      throw new BadRequestException('Este agendamento já está cancelado');
    }

    await this.prisma.agendamento.update({
      where: { id },
      data: { status: 'CANCELADO' },
    });

    this.logger.log(`Agendamento cancelado: ${id}`);
    return { mensagem: 'Agendamento cancelado com sucesso' };
  }
}
