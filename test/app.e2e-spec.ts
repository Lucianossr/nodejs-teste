import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/boleto/ - TITULO - (GET)', () => {
    return request(app.getHttpServer())
      .get('/boleto/21290001192110001210904475617405975870000002000')
      .expect(200)
      .expect({
        barCode: '21299758700000020000001121100012100447561740',
        amount: '20.00',
        expirationDate: '2018-07-16',
      });
  });

  it('/boleto/ - CONVENIO - (GET)', () => {
    return request(app.getHttpServer())
      .get('/boleto/836100000022975900090427744930052207002404199297')
      .expect(200)
      .expect({
        barCode: '83610000002975900090427449300522000240419929',
        amount: '297.59',
        expirationDate: null,
      });
  });
});
