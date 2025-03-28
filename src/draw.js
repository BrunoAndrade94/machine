function mainDraw() {
  background(COR_DE_FUNDO);

  AMBIENTE.atualizar();
  AMBIENTE.desenhar();

  PAINEL.desenhar();

  for (let i = 0; i < ALIMENTOS_INICIAIS; i++) {
    AMBIENTE.adicionarAlimento();
  }
}
