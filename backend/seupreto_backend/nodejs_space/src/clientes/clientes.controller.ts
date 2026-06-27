import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { ClientesService } from './clientes.service';
import { CriarClienteDto } from './dto/criar-cliente.dto';
import { AtualizarClienteDto } from './dto/atualizar-cliente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.BARBEIRO)
  @ApiOperation({ summary: 'Cadastrar novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente cadastrado com sucesso' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado' })
  criar(@Body() dto: CriarClienteDto) {
    return this.clientesService.criar(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.BARBEIRO)
  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes retornada' })
  listar() {
    return this.clientesService.listar();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.BARBEIRO)
  @ApiOperation({ summary: 'Buscar cliente por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes do cliente' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  buscarPorId(@Param('id') id: string) {
    return this.clientesService.buscarPorId(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.BARBEIRO)
  @ApiOperation({ summary: 'Atualizar dados do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  atualizar(@Param('id') id: string, @Body() dto: AtualizarClienteDto) {
    return this.clientesService.atualizar(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.BARBEIRO)
  @ApiOperation({ summary: 'Desativar cliente (soft delete)' })
  @ApiResponse({ status: 200, description: 'Cliente desativado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  excluir(@Param('id') id: string) {
    return this.clientesService.excluir(id);
  }
}
