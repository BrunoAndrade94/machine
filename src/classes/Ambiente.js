class Ambiente {
  constructor() {
    this.criaturas = [];
    this.alimentos = [];
  }

  adicionarCriatura() {
    this.criaturas.push(new Criatura());
  }

  adicionarAlimento() {
    this.alimentos.push(new Alimento());
  }

  verificarSeAlimentou() {
    // Itera sobre as criaturas e os alimentos para verificar interações
    this.criaturas.forEach((criatura) => {
      this.alimentos = this.alimentos.filter((alimento) => {
        const distancia = p5.Vector.dist(criatura.posicao, alimento.posicao);

        // Se a criatura está perto o suficiente do alimento, ela o consome
        if (distancia < CRIATURA_TAMANHO / 2 + ALIMENTO_TAMANHO / 2) {
          criatura.vida += alimento.valor; // Aumenta a vida da criatura
          criatura.vezesQueSeAlimentou++;
          return false; // Remove a comida do ambiente
        }
        return true; // Mantém a comida se não foi consumida
      });
    });
  }

  // evoluir() {
  //   // Filtrar as criaturas que já se alimentaram mais de 3 vezes e têm saúde acima de 50%
  //   let criaturasElegiveis = this.criaturas.filter(
  //     (criatura) =>
  //       criatura.contadorDeAlimentos > 3 &&
  //       criatura.vida > CRIATURA_VIDA_MAXIMA / 2
  //   );

  //   // Ordenar as criaturas elegíveis por vida
  //   criaturasElegiveis.sort((a, b) => b.vida - a.vida);

  //   // Dividir as melhores criaturas para a reprodução
  //   let melhores = criaturasElegiveis.slice(
  //     0,
  //     Math.floor(criaturasElegiveis.length / 2)
  //   );

  //   // Criar novos filhos a partir dos melhores
  //   let filhos = [];
  //   for (let i = 0; i < melhores.length; i++) {
  //     for (let j = i + 1; j < melhores.length; j++) {
  //       // Verificar se as duas criaturas se tocam antes de se reproduzirem
  //       if (melhores[i].posicao.dist(melhores[j].posicao) < CRIATURA_TAMANHO) {
  //         let novaCriatura = melhores[i].reproduzir(melhores[j]);
  //         filhos.push(novaCriatura);
  //       }
  //     }
  //   }

  //   // Substituir as criaturas antigas pelas novas
  //   this.criaturas = melhores.concat(filhos);

  //   // Aplicar mutação nos filhos
  //   this.mutarCriaturas();
  // }

  // mutarCriaturas() {
  //   // this.criaturas.forEach((criatura) => {
  //   //   if (random(1) < 0.05) {
  //   //     // Probabilidade de mutação
  //   //     criatura.genoma.velocidade += random(-0.1, 0.1); // Mutação na velocidade
  //   //     criatura.genoma.sensibilidade += random(-0.05, 0.05); // Mutação na sensibilidade
  //   //     criatura.genoma.eficienciaDoConsumo += random(-0.05, 0.05); // Mutação na eficiência
  //   //   }
  //   // });
  // }

  // evoluir() {
  //   // // Lista de novas criaturas geradas
  //   // const criaturasLength = this.criaturas.length;
  //   // let novasCriaturas = [];

  //   // // Iterar por todas as criaturas para verificar elegibilidade e colisões
  //   // for (let i = 0; i < criaturasLength; i++) {
  //   //   let criaturaA = this.criaturas[i];

  //   //   // Verificar se a criatura A atende aos critérios
  //   //   if (
  //   //     criaturaA.vezesQueSeAlimentou >= 3 &&
  //   //     criaturaA.vida > CRIATURA_VIDA_INICIAL / 2
  //   //   ) {
  //   //     for (let j = i + 1; j < criaturasLength; j++) {
  //   //       let criaturaB = this.criaturas[j];

  //   //       // Verificar se a criatura B atende aos critérios
  //   //       if (
  //   //         criaturaB.vezesQueSeAlimentou >= 3 &&
  //   //         criaturaB.vida > CRIATURA_VIDA_INICIAL / 2
  //   //       ) {
  //   //         // Verificar se as duas criaturas se tocaram
  //   //         if (criaturaA.posicao.dist(criaturaB.posicao) < CRIATURA_TAMANHO) {
  //   //           // Reproduzir uma nova criatura a partir de A e B
  //   //           let novaCriatura = criaturaA.reproduzir(criaturaB);
  //   //           novasCriaturas.push(novaCriatura);
  //   //         }
  //   //       }
  //   //     }
  //   //   }
  //   // }

  //   // Atualizar a lista de criaturas com as novas geradas
  //   // this.criaturas = this.criaturas.concat(novasCriaturas);

  //   // Aplicar mutação nos filhos gerados
  //   // this.mutarCriaturas();
  // }

  desenhar() {
    // Desenhar as criaturas
    for (let criatura of this.criaturas) {
      criatura.desenhar();
    }

    // Desenhar os alimentos
    for (let alimento of this.alimentos) {
      alimento.desenhar();
    }
  }

  atualizar() {
    // Atualizar as vidas das criaturas
    for (let criatura of this.criaturas) {
      criatura.desgasteNatural();
      // criatura.mover();
    }

    // this.evoluir();

    this.verificarSeAlimentou();

    // Remover criaturas mortas (opcional neste ponto)
    this.criaturas = this.criaturas.filter((criatura) => criatura.seEstaViva());
  }
}
