class Criatura {
  constructor() {
    this.ambiente = AMBIENTE;
    this.genoma = new Genoma();
    // this.velocidade = p5.Vector.random2D().setMag(this.genoma.velocidade);

    this.posicao = createVector(random(LARGURA), random(ALTURA));

    this.vezesQueSeAlimentou = 0;
    this.tamanho = CRIATURA_TAMANHO;
    this.vida = CRIATURA_VIDA_INICIAL;
    this.idade = 0; // AINDA SEM IMPLEMENTACAO
    this.taxaDePerdaDeVida = TAXA_DE_PERDA_DE_VIDA;
  }

  corVida() {
    let faixaVida = Math.floor(this.vida / 20);

    switch (faixaVida) {
      case 0:
        return color(255, 0, 0); // Vermelho (0-20%)
      case 1:
        return color(255, 255, 0); // Amarelo (20-40%)
      case 2:
        return color(255, 165, 0); // Laranja (40-60%)
      case 3:
        return color(0, 0, 255); // Azul (60-80%)
      default:
        return color(0, 255, 0); // Verde (80-100%)
    }
  }

  encontrarAlimento() {
    let comidaMaisProxima = null;
    let distanciaMinima = Infinity; // Começa com uma distância muito grande

    // Itera sobre todos os alimentos no ambiente
    for (let alimento of this.ambiente.alimentos) {
      const distancia = p5.Vector.dist(this.posicao, alimento.posicao);

      // Se encontrar uma comida mais próxima, atualiza a referência
      if (distancia < distanciaMinima) {
        distanciaMinima = distancia;
        comidaMaisProxima = alimento;
      }
    }

    // Retorna o alimento mais próximo ou null se não houver nenhum alimento
    return comidaMaisProxima;
  }

  mover() {
    const alimentoProximo = this.encontrarAlimento();

    if (alimentoProximo) {
      const direcao = alimentoProximo.posicao
        .copy()
        .sub(this.posicao)
        .normalize();

      this.genoma.velocidade = direcao.mult(this.genoma.velocidade);
    }

    this.posicao.add(this.genoma.velocidade);
    // Faz as criaturas "rebaterem" ao chegar nos limites do canvas
    if (this.posicao.x < 0 || this.posicao.x > LARGURA) this.velocidade.x *= -1;

    if (this.posicao.y < 0 || this.posicao.y > ALTURA) this.velocidade.y *= -1;
  }

  evoluir() {
    if (this.vezesQueSeAlimentou > 3 && this.vida > CRIATURA_VIDA_INICIAL / 2) {
      this.posicao.add(this.velocidade);
    }
  }

  reproduzir(parceiro) {
    // // Crossover simples - mistura genes
    // let novosGenes = {
    //   velocidade: (this.genoma.velocidade + parceiro.genoma.velocidade) / 2,
    //   sensibilidade:
    //     (this.genoma.sensibilidade + parceiro.genoma.sensibilidade) / 2,
    //   eficienciaConsumo:
    //     (this.genoma.eficienciaNoConsumo +
    //       parceiro.genoma.eficienciaNoConsumo) /
    //     2,
    // };
    // // Criar uma nova criatura com os genes resultantes
    // let novaCriatura = new Criatura();
    // novaCriatura.genes = novosGenes;
    // return novaCriatura;
  }

  desenhar() {
    fill(this.corVida());
    ellipse(this.posicao.x, this.posicao.y, this.tamanho);
  }

  desgasteNatural() {
    if (this.vida <= 0) return (this.vida = 0);

    const magnitude = this.genoma.velocidade.mag();
    const desgaste = map(
      magnitude,
      CRIATURA_VELOCIDADE_MINIMA,
      CRIATURA_VELOCIDADE_MAXIMA,
      DESGASTE_MINIMO,
      DESGASTE_MAXIMO
    );
    this.vida -= desgaste;
    // this.vida -= this.taxaDePerdaDeVida;
  }

  seEstaViva() {
    return this.vida > 0;
  }
}
