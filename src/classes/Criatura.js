class Criatura {
  constructor(genoma = new Genoma()) {
    this.genoma = genoma;
    this.ambiente = AMBIENTE;

    this.posicao = createVector(random(LARGURA), random(ALTURA));

    this.mente = new RedeNeuralTF(6, 10, 2);

    this.vezesQueSeAlimentou = 0;
    this.tamanho = CRIATURA_TAMANHO;
    // this.vida = CRIATURA_VIDA_INICIAL;
    this.idade = 0; // AINDA SEM IMPLEMENTACAO
    this.taxaDePerdaDeVida = TAXA_DE_PERDA_DE_VIDA;
  }

  decisaoComIA() {
    const alimentoProximo = this.encontrarAlimento();

    const direcaoAoAlimento = alimentoProximo
      ? p5.Vector.sub(alimentoProximo.posicao, this.posicao).normalize()
      : createVector(0, 0);

    let distancia = alimentoProximo
      ? p5.Vector.dist(this.posicao, alimentoProximo.posicao)
      : LARGURA; // Se não houver alimento, assumimos distância máxima

    // Verificar se o alimento está dentro do campo de visão da criatura
    const anguloCampoVisao = this.genoma.campoDeVisao; // Campo de visão no genoma (valor entre 0 e 1)

    // Usando atan2 para calcular o ângulo entre a direção da criatura e a direção até o alimento
    const anguloDeVisao =
      Math.atan2(direcaoAoAlimento.y, direcaoAoAlimento.x) -
      Math.atan2(this.genoma.velocidade.y, this.genoma.velocidade.x);

    // Ajustar o ângulo para estar entre -PI e PI
    const anguloDeVisaoNormalizado = Math.atan2(
      Math.sin(anguloDeVisao),
      Math.cos(anguloDeVisao)
    );

    // Se o alimento está dentro do campo de visão, pode ser considerado
    const dentroDoCampoDeVisao =
      Math.abs(anguloDeVisaoNormalizado) <= anguloCampoVisao * Math.PI;

    // Normalizamos as entradas:
    const entradas = [
      this.genoma.vida / CRIATURA_VIDA_INICIAL, // Vida normalizada
      distancia / LARGURA, // Distância normalizada
      direcaoAoAlimento.x, // Direção X normalizada
      direcaoAoAlimento.y, // Direção Y normalizada
      this.genoma.velocidade.x / GENOMA_VELOCIDADE_MAXIMA,
      this.genoma.velocidade.y / GENOMA_VELOCIDADE_MAXIMA,
    ];

    // Se o alimento está dentro do campo de visão, a rede neural pode tomar a decisão
    let saidas = [0, 0]; // Caso o alimento não esteja no campo de visão

    if (dentroDoCampoDeVisao) {
      // Obter a saída da rede neural
      saidas = this.mente.prever(entradas);
    }

    // Converter as saídas em um vetor de direção
    const direcao = createVector(
      map(saidas[0], 0, 1, -1, 1), // Converter para intervalo [-1, 1]
      map(saidas[1], 0, 1, -1, 1) // Converter para intervalo [-1, 1]
    ).normalize();

    // Ajustar a velocidade mantendo uma magnitude razoável
    const novaVelocidade = direcao.mult(GENOMA_VELOCIDADE_INICIAL);
    this.genoma.velocidade.set(novaVelocidade.x, novaVelocidade.y);
  }

  corVida() {
    // Calcular a porcentagem de vida
    let porcentagemVida = this.genoma.vida / CRIATURA_VIDA_INICIAL;

    // Determinar a cor com base na porcentagem de vida
    if (porcentagemVida <= 0.2) {
      this.genoma.velocidade.add(p5.Vector.random2D().mult(0.2));
      return color(255, 0, 0); // Vermelho (0-20% de vida)
    } else if (porcentagemVida <= 0.4) {
      return color(255, 255, 0); // Amarelo (20-40% de vida)
    } else if (porcentagemVida <= 0.6) {
      return color(255, 165, 0); // Laranja (40-60% de vida)
    } else if (porcentagemVida <= 0.8) {
      return color(0, 0, 255); // Azul (60-80% de vida)
    } else {
      return color(0, 255, 0); // Verde (80-100% de vida)
    }
  }

  encontrarAlimento() {
    let comidaMaisProxima = null;
    let distanciaMinima = Infinity; // Começa com uma distância muito grande

    // Itera sobre todos os alimentos no ambiente
    for (let alimento of this.ambiente.alimentos) {
      const distancia = p5.Vector.dist(this.posicao, alimento.posicao);

      // Se encontrar uma comida mais próxima, atualiza a referência
      if (
        distancia <= this.genoma.campoDeVisao &&
        distancia < distanciaMinima
      ) {
        distanciaMinima = distancia;
        comidaMaisProxima = alimento;
      }
    }
    return comidaMaisProxima;
  }

  decisaoSemIA() {
    const alimentoProximo = this.encontrarAlimento();
    if (alimentoProximo) {
      const direcao = alimentoProximo.posicao
        .copy()
        .sub(this.posicao)
        .normalize()
        .mult(this.genoma.velocidade.mag());
      this.genoma.velocidade.lerp(direcao, 0.1);
    }
  }

  mover() {
    const velocidadeOriginal = this.genoma.velocidade.mag();

    // this.decisaoSemIA();

    this.decisaoComIA();

    this.genoma.velocidade.setMag(velocidadeOriginal);
    this.posicao.add(this.genoma.velocidade);
    // Faz as criaturas "rebaterem" ao chegar nos limites do canvas
    if (this.posicao.x < 0 || this.posicao.x > LARGURA) {
      this.genoma.velocidade.x *= -1;
      // this.posicao.x = constrain(this.posicao.x, 0, LARGURA);
    }

    if (this.posicao.y < 0 || this.posicao.y > ALTURA) {
      this.genoma.velocidade.y *= -1;
      // this.posicao.y = constrain(this.posicao.y, 0, ALTURA);
    }
  }

  desenhar() {
    noStroke();
    fill(255, 255, 255, 50);
    ellipse(this.posicao.x, this.posicao.y, this.genoma.campoDeVisao * 2);

    fill(this.corVida());
    ellipse(this.posicao.x, this.posicao.y, this.tamanho);
  }

  desgasteNatural() {
    if (!this.seEstaViva()) return (this.genoma.vida = 0);

    const magnitude = this.genoma.velocidade.mag();
    const desgaste = map(
      magnitude,
      CRIATURA_VELOCIDADE_MINIMA,
      CRIATURA_VELOCIDADE_MAXIMA,
      DESGASTE_MINIMO,
      DESGASTE_MAXIMO
    );
    this.genoma.vida -= desgaste;
  }

  seEstaViva() {
    return this.genoma.vida > 0;
  }
}
