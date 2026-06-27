import { Injectable, ConflictException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegistroDto } from './dto/registro.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registro(dto: RegistroDto) {
    const existente = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existente) {
      throw new ConflictException('Este e-mail já está cadastrado');
    }

    const senhaHash = await bcrypt.hash(dto.senha, 10);
    const user = await this.prisma.user.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
        role: dto.role || 'CLIENTE',
        telefone: dto.telefone,
      },
    });

    this.logger.log(`Novo usuário registrado: ${user.email} (${user.role})`);

    const { senha: _, ...resultado } = user;
    return { mensagem: 'Usuário registrado com sucesso', usuario: resultado };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.ativo) {
      throw new UnauthorizedException('Conta desativada. Entre em contato com o administrador.');
    }

    const senhaValida = await bcrypt.compare(dto.senha, user.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    this.logger.log(`Login realizado: ${user.email}`);

    const { senha: _, ...usuario } = user;
    return { access_token: token, usuario };
  }
}
