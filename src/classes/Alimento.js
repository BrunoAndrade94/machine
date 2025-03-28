class Alimento {
  constructor() {
    this.posicao = createVector(random(LARGURA), random(ALTURA));
    this.velocidade = p5.Vector.random2D().setMag(random(0.1, 1.6));
    this.valor = ALIMENTO_VALOR;
    this.tamanho = ALIMENTO_TAMANHO;
  }

  mover() {
    if (this.posicao.x < 0 || this.posicao.x > LARGURA) this.velocidade.x *= -1;
    if (this.posicao.y < 0 || this.posicao.y > ALTURA) this.velocidade.y *= -1;
    this.posicao.add(this.velocidade);
  }

  desenhar() {
    fill(255);
    ellipse(this.posicao.x, this.posicao.y, this.tamanho);

    this.mover();
  }
}
