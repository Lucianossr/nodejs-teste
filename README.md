## Descrição

Consulta de Linhas digitáveis.

### Request
```
GET/ http://localhost:8080/boleto/21290001192110001210904475617405975870000002000
```

### Response
```json
{
  "barCode":"21299758700000020000001121100012100447561740",
  "amount":"20.00",
  "expirationDate":"2018-07-16"
}
```

## Tecnologias Utilizadas

[Nest](https://github.com/nestjs/nest)
[Node.js](https://nodejs.org/en/)
[Docker](https://www.docker.com/)
[Heroku](https://www.heroku.com/)

## Instalação

```bash
$ npm install
```

## Rodando o app.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Testes

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Docker

```bash
#build
docker build -t node-teste .

#run
docker run -p 8080:8080 node-teste 
```

## Heroku
+ Request (application/json)
```
https://node-teste-lucianossr.herokuapp.com/boleto/21290001192110001210904475617405975870000002000
```