import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/boleto/:line')
  boleto(@Param('line') line: string, @Res() res: Response) {
    const result = this.appService.boleto(line);
    res.status(result.status).json(result.content);
  }
}
