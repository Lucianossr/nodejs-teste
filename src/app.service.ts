import { Injectable } from '@nestjs/common';
import { Boleto } from './utils/boleto';

@Injectable()
export class AppService {
  boleto(line: string): Record<string, any> {
    try {
      const boleto = new Boleto(line);
      return { status: 200, content: boleto.toJSON() };
    } catch (error) {
      return {
        status: 400,
        content: { msg: 'Linha inválida', errorMsg: error },
      };
    }
  }
}
