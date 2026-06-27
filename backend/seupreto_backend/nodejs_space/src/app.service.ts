import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      status: 'online',
      servico: 'SeuPreto Platform API',
      versao: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
