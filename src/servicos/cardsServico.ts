import { Card } from '../types/entidades';

const ATRASO_MS = 1200;

export function buscarCards(): Promise<Card[]> {
  const cards: Card[] = [
    { id: 1, colunaId: 1, titulo: 'Desenhar tela do quadro', descricao: 'Colunas e cards lado a lado', posicao: 1, criadoEm: new Date() },
    { id: 2, colunaId: 2, titulo: 'Tipar entidades', posicao: 1, criadoEm: new Date() },
    { id: 3, colunaId: 3, titulo: 'Escrever README', descricao: 'Recorte, telas e o que fica de fora', posicao: 1, criadoEm: new Date() },
  ];

  return new Promise((resolve) => {
    setTimeout(() => resolve(cards), ATRASO_MS);
  });
}
