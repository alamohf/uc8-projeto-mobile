import { Card } from './types/entidades';

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

export function filtrarCards(cards: Card[], consulta: string): Card[] {
  const termo = normalizar(consulta);
  if (termo === '') {
    return [];
  }
  return cards.filter((card) => normalizar(`${card.titulo} ${card.descricao ?? ''}`).includes(termo));
}
