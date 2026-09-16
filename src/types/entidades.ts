export interface Coluna {
  id: number;
  titulo: string;
  posicao: number;
}

export interface Card {
  id: number;
  colunaId: number;
  titulo: string;
  descricao?: string;
  posicao: number;
  criadoEm: Date;
}
