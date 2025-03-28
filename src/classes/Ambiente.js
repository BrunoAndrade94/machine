class Ambiente {
  constructor() {
    this.criaturas = [];
    this.alimentos = [];
    this.colisoes = 0;
    this.cruzamentos = 0;
  }

  adicionarCriatura() {
    this.criaturas.push(new Criatura());
  }

  adicionarAlimento() {
    if (this.alimentos.length > ALIMENTOS_INICIAIS * 2) return;
    this.alimentos.push(new Alimento());
  }

  seColidiu(criaturaA, criaturaB) {
    // Calcula o quadrado da distância entre os centros das criaturas
    const dx = criaturaA.posicao.x - criaturaB.posicao.x;
    const dy = criaturaA.posicao.y - criaturaB.posicao.y;
    const distanciaQuadrada = dx * dx + dy * dy;

    // Calcula o quadrado da soma dos raios
    const somaDosRaios = criaturaA.tamanho + criaturaB.tamanho;
    const somaDosRaiosQuadrada = somaDosRaios * somaDosRaios;

    // Verifica se a distância quadrada é menor ou igual ao quadrado da soma dos raios
    return distanciaQuadrada <= somaDosRaiosQuadrada;
  }

  sePodeReproduzir(criatura) {
    return (
      criatura.vezesQueSeAlimentou >= 20 &&
      criatura.genoma.vida > CRIATURA_VIDA_INICIAL * 0.33
    );
  }

  colidir() {
    for (let i = 0; i < this.criaturas.length; i++) {
      for (let j = i + 1; j < this.criaturas.length; j++) {
        const criaturaA = this.criaturas[i];
        const criaturaB = this.criaturas[j];

        if (this.seColidiu(criaturaA, criaturaB)) {
          const podeReproduzirA = this.sePodeReproduzir(criaturaA);
          const podeReproduzirB = this.sePodeReproduzir(criaturaB);

          if (podeReproduzirA && podeReproduzirB) {
            this.cruzamento(criaturaA, criaturaB);
          } else {
            this.repelirCriaturas(criaturaA, criaturaB);
          }
        }
      }
    }
  }

  repelirCriaturas(criaturaA, criaturaB) {
    // Penalidade pela colisão
    criaturaA.genoma.vida -= PENALIDADE_DE_COLISAO;
    criaturaB.genoma.vida -= PENALIDADE_DE_COLISAO;

    // Repulsão entre as criaturas
    const dx = criaturaB.posicao.x - criaturaA.posicao.x;
    const dy = criaturaB.posicao.y - criaturaA.posicao.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    if (distancia > 0) {
      // Evitar divisão por zero
      const fatorRepulsao = FATOR_REPULSAO; // Ajuste conforme necessário
      const deslocamentoX = (dx / distancia) * fatorRepulsao;
      const deslocamentoY = (dy / distancia) * fatorRepulsao;

      criaturaA.posicao.x -= deslocamentoX;
      criaturaA.posicao.y -= deslocamentoY;

      criaturaB.posicao.x += deslocamentoX;
      criaturaB.posicao.y += deslocamentoY;
    }
  }

  cruzamento(criaturaA, criaturaB) {
    // Encontrar os índices das criaturas no array
    const indiceA = this.criaturas.indexOf(criaturaA);
    const indiceB = this.criaturas.indexOf(criaturaB);

    // Combinar os genomas de criaturaA e criaturaB
    const genomaFilho = this.unirGenomas(criaturaA.genoma, criaturaB.genoma);

    // Criar uma nova criatura com o genoma combinado
    const novaCriatura = new Criatura(genomaFilho);

    // Adicionar a nova criatura ao ambiente
    this.criaturas.push(novaCriatura);

    // Remover os pais do array (usando splice)
    if (indiceA > -1) {
      this.criaturas.splice(indiceA, 1);
    }
    // Após a remoção de criaturaA, o índice de criaturaB pode mudar, então devemos verificar isso
    if (indiceB > -1) {
      // Se o índice de criaturaB for maior que o de criaturaA, significa que criaturaB foi movida
      if (indiceB > indiceA) {
        this.criaturas.splice(indiceB - 1, 1); // Subtrai 1 devido ao deslocamento
      } else {
        this.criaturas.splice(indiceB, 1);
      }
    }
    this.cruzamentos++;
  }

  unirGenomas(genomaA, genomaB) {
    return new Genoma(
      p5.Vector.lerp(genomaA.velocidade, genomaB.velocidade, 0.5),
      // genomaA.sensibilidade + genomaB.sensibilidade / random(2, 4),
      // genomaA.eficienciaNoConsumo + genomaB.eficienciaNoConsumo / random(2, 4),
      genomaA.campoDeVisao + genomaB.campoDeVisao / random(2, 4),
      genomaA.vida + genomaB.vida / random(2, 4)
    );
  }

  verificarSeAlimentou() {
    // Itera sobre as criaturas e os alimentos para verificar interações
    this.criaturas.forEach((criatura) => {
      this.alimentos = this.alimentos.filter((alimento) => {
        const distancia = p5.Vector.dist(criatura.posicao, alimento.posicao);

        // Se a criatura está perto o suficiente do alimento, ela o consome
        if (distancia < CRIATURA_TAMANHO / 2 + ALIMENTO_TAMANHO / 2) {
          this.atribuicoesAposAlimentar(criatura, alimento);
          return false; // Remove a comida do ambiente
        }
        return true; // Mantém a comida se não foi consumida
      });
    });
  }

  atribuicoesAposAlimentar(criatura, alimento) {
    criatura.genoma.vida += alimento.valor; // Aumenta a vida da criatura
    criatura.vezesQueSeAlimentou++;
    criatura.genoma.campoDeVisao += 1;
    criatura.genoma.eficienciaNoConsumo += 0.1;
    criatura.genoma.sensibilidade += 0.1;
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
      criatura.mover();
    }

    this.colidir();

    // this.evoluir();

    this.verificarSeAlimentou();

    // Remover criaturas mortas (opcional neste ponto)
    this.criaturas = this.criaturas.filter((criatura) => criatura.seEstaViva());
  }
}
