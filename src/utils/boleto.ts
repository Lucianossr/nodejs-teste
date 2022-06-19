export class Boleto {
  private line: string;

  constructor(line: string) {
    this.line = line;
  }

  validationData() {
    //Validacao somente numeros
    const digits_only = (string) =>
      [...string].every((c) => '0123456789'.includes(c));

    if (!digits_only(this.line)) {
      throw 'Informar apenas numeros!';
    }

    //Validacao qtd numeros
    if (this.line.length < 44 || this.line.length > 48) {
      throw 'Quantidade de numeros incorreta!';
    }

    //Validacao Digitos Verificadores
    this.checkDV();
  }

  checkDV() {
    const type = this.defineType();

    if (type == 'CONVENIO') this.checkDVConvenio();
    if (type == 'TITULO') this.checkDVTitulo();
  }

  checkDVConvenio() {
    const line = this.line;

    const listFields = [];
    const campo1 = line.substr(0, 12);
    listFields.push(campo1);
    const campo2 = line.substr(12, 12);
    listFields.push(campo2);
    const campo3 = line.substr(24, 12);
    listFields.push(campo3);
    const campo4 = line.substr(36, 12);
    listFields.push(campo4);

    listFields.map((v: string) =>
      this.calculateDV(v.substring(0, v.length - 1), Number(v[v.length - 1])),
    );
  }

  checkDVTitulo() {
    const line = this.line;

    const listFields = [];
    const campo1 = line.substring(0, 10);
    listFields.push(campo1);
    const campo2 = line.substring(10, 21);
    listFields.push(campo2);
    const campo3 = line.substring(21, 32);
    listFields.push(campo3);

    listFields.map((v: string) =>
      this.calculateDV(
        v.substring(0, v.length - 1),
        Number(v.slice(v.length - 1)),
      ),
    );
  }

  calculateDV(campo: string, dv: number) {
    //Reverse
    campo = campo.split('').reverse().join('');

    let resultCalcDV = 0;
    for (let i = 0; i < campo.length; i++) {
      const field = Number(campo[i]);
      const factor = this.determineFactor(i);
      const calc = field * factor;
      resultCalcDV += this.evaluteAlgarism(calc);
    }

    const resto = resultCalcDV % 10;

    const resultDV = 10 - resto;

    if (resultDV != dv) {
      throw 'Falha na verificação do DV';
    }
  }

  determineFactor(index: number) {
    if (index == 0) {
      return 2;
    }
    // Impar retornar 1, Par retorna 2
    return index & 1 ? 1 : 2;
  }

  evaluteAlgarism(calc: number) {
    if (calc > 9) {
      calc = Number(calc.toString()[0]) + Number(calc.toString()[1]);
    }
    return calc;
  }

  defineType() {
    const digt = this.line.substr(0, 1);

    //Definicao para diferenciar Convenio de Titulo.
    //Constante “8” para identificar arrecadação.
    //Conforme pag 7, manual Febraban.
    if (digt == '8') {
      return 'CONVENIO';
    }

    return 'TITULO';
  }

  amount() {
    const type = this.defineType();

    let value: string;
    if (type === 'CONVENIO')
      value = `${this.line.substr(0, 11)}${this.line.substring(12)}`.substr(
        4,
        11,
      );

    if (type === 'TITULO') value = this.line.substr(-8, 8);

    return (parseInt(value, 10) / 100.0).toFixed(2);
  }

  expirationDate() {
    const type = this.defineType();
    const febrabanDate = new Date('1997-10-07');

    if (type == 'CONVENIO') return null;

    let factor: number | null = null;

    const days = Number(this.line.substr(33, 4));

    factor = days * (24 * 60 * 60 * 1000);

    const returnDate = new Date(febrabanDate.getTime() + factor);

    return returnDate.toISOString().substring(0, 10);
  }

  barCode() {
    const type = this.defineType();

    let barCode = '';
    if (type === 'TITULO') {
      barCode =
        this.line.substr(0, 4) +
        this.line.substr(32, 15) +
        this.line.substr(4, 5) +
        this.line.substr(10, 10) +
        this.line.substr(21, 10);
    }
    if (type === 'CONVENIO') {
      barCode =
        this.line.substr(0, 11) +
        this.line.substr(12, 11) +
        this.line.substr(24, 11) +
        this.line.substr(36, 11);
    }
    return barCode;
  }

  toJSON() {
    this.validationData();
    return {
      barCode: this.barCode(),
      amount: this.amount(),
      expirationDate: this.expirationDate(),
    };
  }
}
