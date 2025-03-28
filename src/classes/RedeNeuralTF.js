class RedeNeuralTF {
  constructor(entradas, escondidas, saidas) {
    this.modelo = tf.sequential();

    // Camada escondida
    this.modelo.add(
      tf.layers.dense({
        units: escondidas,
        inputShape: [entradas],
        activation: "sigmoid",
      })
    );

    // Camada de saída
    this.modelo.add(
      tf.layers.dense({
        units: saidas,
        activation: "sigmoid",
      })
    );

    // Configuração do otimizador e função de perda
    this.modelo.compile({
      optimizer: tf.train.adam(),
      loss: "meanSquaredError",
    });
  }

  async treinar(entradas, saidasEsperadas, epocas = 10) {
    const entradasTensor = tf.tensor2d(entradas);
    const saidasTensor = tf.tensor2d(saidasEsperadas);

    await this.modelo.fit(entradasTensor, saidasTensor, {
      epochs: epocas,
    });

    entradasTensor.dispose();
    saidasTensor.dispose();
  }

  prever(entradas) {
    const entradasTensor = tf.tensor2d([entradas]);
    const saidasTensor = this.modelo.predict(entradasTensor);
    const saidas = saidasTensor.arraySync()[0];

    entradasTensor.dispose();
    saidasTensor.dispose();

    return saidas;
  }
}
