class Genoma {
  constructor() {
    this.velocidade = p5.Vector.random2D().setMag(
      random(GENOMA_VELOCIDADE_MINIMA, GENOMA_VELOCIDADE_MAXIMA)
    );
    this.sensibilidade = random(0.00001, 0.00002);
    this.eficienciaNoConsumo = random(0.0001, 0.0003);
  }
}
