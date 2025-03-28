class RedeNeural {
  constructor(entradas, escondidas, saidas) {
    // Inicializa os pesos de entrada -> camada escondida
    this.pesosIH = new Array(escondidas)
      .fill(0)
      .map(() => new Array(entradas).fill(0).map(() => random(-1, 1)));
    // Inicializa os pesos da camada escondida -> saída
    this.pesosHO = new Array(saidas)
      .fill(0)
      .map(() => new Array(escondidas).fill(0).map(() => random(-1, 1)));
    // Inicializa os biases
    this.biasH = new Array(escondidas).fill(0).map(() => random(-1, 1));
    this.biasO = new Array(saidas).fill(0).map(() => random(-1, 1));
  }

  ativacao(x) {
    // Função de ativação sigmoid
    return 1 / (1 + Math.exp(-x));
  }

  feedForward(entradas) {
    // Calcula a ativação da camada escondida
    let escondida = this.pesosIH.map((linha, i) => {
      let soma = this.biasH[i];
      for (let j = 0; j < entradas.length; j++) {
        soma += linha[j] * entradas[j];
      }
      return this.ativacao(soma);
    });

    // Calcula a saída final
    let saida = this.pesosHO.map((linha, i) => {
      let soma = this.biasO[i];
      for (let j = 0; j < escondida.length; j++) {
        soma += linha[j] * escondida[j];
      }
      return this.ativacao(soma);
    });

    return saida;
  }
}
