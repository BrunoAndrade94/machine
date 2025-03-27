class Painel {
  constructor(ambiente) {
    this.ambiente = ambiente;
  }

  calcMediaVida() {
    const criaturas = this.ambiente.criaturas.filter((criatura) =>
      criatura.seEstaViva()
    );

    if (criaturas.length === 0) return 0;

    const somaVida = criaturas.reduce(
      (soma, criatura) => soma + criatura.vida,
      0
    );

    return (somaVida / criaturas.length).toFixed();
  }

  calcTotalCriaturas() {
    return this.ambiente.criaturas.length;
  }

  calcMaximaVida() {
    const maxima = Math.max(
      ...this.ambiente.criaturas.map((criatura) => criatura.vida)
    ).toFixed();

    return maxima == -Infinity ? 0 : maxima;
  }

  calcCriaturasMortas() {
    let totalCriaturas = this.calcTotalCriaturas();
    if (totalCriaturas == 0) return 0;
    return CRIATURAS_INICIAIS - totalCriaturas;
  }

  desenhar() {
    fill(255);
    textSize(25);
    text("SIMULAÇÃO DE VIDA", 10, 30);

    textSize(25);
    text(`CRIATURAS VIVAS: ${this.calcTotalCriaturas()}`, 10, 60);

    textSize(25);
    text(`CRIATURAS MORTAS: ${this.calcCriaturasMortas()}`, 10, 90);

    textSize(25);
    text(`ALIMENTOS: ${this.ambiente.alimentos.length}`, 10, 120);

    textSize(25);
    text(`MÉDIA DE VIDA: ${this.calcMediaVida()}`, 10, 150);

    textSize(25);
    text(`MÁXIMA DE VIDA: ${this.calcMaximaVida()}`, 10, 180);

    for (let i = 0; i > this.ambiente.criaturas.length; i++) {
      return;
    }
    if (!this.ambiente.criaturas[0].vezesQueSeAlimentou) return;
    textSize(25);
    text(
      `INDV. 1 COMEU: ${this.ambiente.criaturas[0].vezesQueSeAlimentou}`,
      10,
      210
    );
    text(
      `INDV. 2 COMEU: ${this.ambiente.criaturas[1].vezesQueSeAlimentou}`,
      10,
      240
    );
    text(
      `INDV. 3 COMEU: ${this.ambiente.criaturas[2].vezesQueSeAlimentou}`,
      10,
      270
    );
    text(
      `INDV. 4 COMEU: ${this.ambiente.criaturas[3].vezesQueSeAlimentou}`,
      10,
      300
    );
    text(
      `INDV. 5 COMEU: ${this.ambiente.criaturas[4].vezesQueSeAlimentou}`,
      10,
      330
    );
  }
}
