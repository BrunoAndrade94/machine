class Genoma {
  constructor(
    velocidade = p5.Vector.random2D().setMag(
      random(GENOMA_VELOCIDADE_MINIMA, GENOMA_VELOCIDADE_MAXIMA)
    ),
    sensibilidade = 0,
    // sensibilidade = random(0.00001, 0.00002),
    eficienciaNoConsumo = 0,
    // eficienciaNoConsumo = random(0.0001, 0.0003),
    campoDeVisao = GENOMA_CAMPO_DE_VISAO,
    vida = CRIATURA_VIDA_INICIAL
  ) {
    this.velocidade = velocidade;
    this.sensibilidade = sensibilidade;
    this.eficienciaNoConsumo = eficienciaNoConsumo;
    this.campoDeVisao = campoDeVisao;
    this.vida = vida;
  }
}
