import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('TEST - BOLETO', () => {
  let app: TestingModule;

  const jsonResponseMock = {
    json: jest.fn((x) => x),
  };

  const responseMock = {
    status: jest.fn(() => jsonResponseMock),
  } as unknown as Response;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('TEST - Status CODE', () => {
    it('should return a status of 200', () => {
      const appController = app.get<AppController>(AppController);

      appController.boleto(
        '21290001192110001210904475617405975870000005000',
        responseMock,
      );

      expect(responseMock.status).toHaveBeenCalledWith(200);
    });

    it('should return a status of 400', () => {
      const appController = app.get<AppController>(AppController);

      appController.boleto(
        '2129000119211000cxcasx75870000005000',
        responseMock,
      );

      expect(responseMock.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Valitations', () => {
    it('should return a error - only numbers', () => {
      const appController = app.get<AppController>(AppController);

      appController.boleto(
        '21290001192140dsdsdsds0012109044756174',
        responseMock,
      );

      expect(jsonResponseMock.json).toHaveBeenCalledWith({
        msg: 'Linha inválida',
        errorMsg: 'Informar apenas numeros!',
      });
    });

    it('should return a error - quantity of numbers', () => {
      const appController = app.get<AppController>(AppController);

      appController.boleto('212900011921400012109044756174', responseMock);

      expect(jsonResponseMock.json).toHaveBeenCalledWith({
        msg: 'Linha inválida',
        errorMsg: 'Quantidade de numeros incorreta!',
      });
    });

    describe('should return a error - Failled DV', () => {
      it('DV - TITULO', () => {
        const appController = app.get<AppController>(AppController);

        appController.boleto(
          '21290001192140001210904475617405975870000002000',
          responseMock,
        );

        expect(jsonResponseMock.json).toHaveBeenCalledWith({
          msg: 'Linha inválida',
          errorMsg: 'Falha na verificação do DV',
        });
      });

      it('DV - Convenio', () => {
        const appController = app.get<AppController>(AppController);

        appController.boleto(
          '836100000022975900090427744930052207002404199299',
          responseMock,
        );

        expect(jsonResponseMock.json).toHaveBeenCalledWith({
          msg: 'Linha inválida',
          errorMsg: 'Falha na verificação do DV',
        });
      });
    });
  });

  describe('should return sucess - Boletos', () => {
    it('should return type CONVENIO', () => {
      const appController = app.get<AppController>(AppController);

      appController.boleto(
        '836100000022975900090427744930052207002404199297',
        responseMock,
      );

      expect(jsonResponseMock.json).toHaveBeenCalledWith({
        barCode: '83610000002975900090427449300522000240419929',
        amount: '297.59',
        expirationDate: null,
      });
    });

    it('should return type TITULO', () => {
      const appController = app.get<AppController>(AppController);

      appController.boleto(
        '21290001192110001210904475617405975870000002000',
        responseMock,
      );

      expect(jsonResponseMock.json).toHaveBeenCalledWith({
        barCode: '21299758700000020000001121100012100447561740',
        amount: '20.00',
        expirationDate: '2018-07-16',
      });
    });
  });
});
