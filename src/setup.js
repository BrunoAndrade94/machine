function mainSetup() {
  createCanvas(LARGURA, ALTURA);

  criar();
}

function criar() {
  AMBIENTE = new Ambiente();
  PAINEL = new Painel(AMBIENTE);

  for (let i = 0; i < CRIATURAS_INICIAIS; i++) {
    AMBIENTE.adicionarCriatura();
  }

  // Criar alimentos iniciais
  for (let i = 0; i < ALIMENTOS_INICIAIS; i++) {
    AMBIENTE.adicionarAlimento();
  }
}
