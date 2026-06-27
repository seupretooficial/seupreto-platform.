import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CriarClienteDto } from './dto/criar-cliente.dto';
import { AtualizarClienteDto } from './dto/atualizar-cliente.dto';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger(ClientesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CriarClienteDto) {
    const existente = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existente) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const cliente = await this.prisma.user.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
        role: 'CLIENTE',
        telefone: dto.telefone,
      },
    });

    this.logger.log(`Cliente criado: ${cliente.email}`);
    const { senha: _, ...resultado } = cliente;
    return resultado;
  }

  async listar() {
    const clientes = await this.prisma.user.findMany({
      where: { role: 'CLIENTE' },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { nome: 'asc' },
    });
    return clientes;
  }

  async buscarPorId(id: string) {
    const cliente = await this.prisma.user.findFirst({
      where: { id, role: 'CLIENTE' },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
        agendamentosComoCliente: {
          select: {
            id: true,
            dataHora: true,
            servico: true,
            status: true,
            barbeiro: { select: { id: true, nome: true } },
          },
          orderBy: { dataHora: 'desc' },
          take: 10,
        },
      },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }
    return cliente;
  }

  async atualizar(id: string, dto: AtualizarClienteDto) {
    const cliente = await this.prisma.user.findFirst({ where: { id, role: 'CLIENTE' } });
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    if (dto.email && dto.email !== cliente.email) {
      const emailExiste = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (emailExiste) {
        throw new ConflictException('Este e-mail já está em uso');
      }
    }

    const data: any = { ...dto };
    if (dto.senha) {
      data.senha = await bcrypt.hash(dto.senha, 10);
    }

    const atualizado = await this.prisma.user.update({
      where: { id },
      data,
    });

    this.logger.log(`Cliente atualizado: ${atualizado.email}`);
    const { senha: _, ...resultado } = atualizado;
    return resultado;
  }

  async excluir(id: string) {
    const cliente = await this.prisma.user.findFirst({ where: { id, role: 'CLIENTE' } });
    if (!cliente) {
      throw new NotFoundException('Cliente não encontrado');
    }

    await this.prisma.user.update({
      where: { id },
      data: { ativo: false },
    });

    this.logger.log(`Cliente desativado: ${cliente.email}`);
    return { mensagem: 'Cliente desativado com sucesso' };
  }
}
