import { COLUNA_FAZENDO, COLUNA_FAZER, COLUNA_FEITO } from './colunas';

export interface Acao {
  titulo: string;
  destino: number;
  destaque: boolean;
}

export function acoesDaColuna(colunaId: number): Acao[] {
  switch (colunaId) {
    case COLUNA_FEITO:
      return [{ titulo: 'Reabrir', destino: COLUNA_FAZER, destaque: false }];
    case COLUNA_FAZENDO:
      return [
        { titulo: 'Voltar', destino: COLUNA_FAZER, destaque: false },
        { titulo: 'Concluir', destino: COLUNA_FEITO, destaque: true },
      ];
    default:
      return [
        { titulo: 'Mover', destino: COLUNA_FAZENDO, destaque: false },
        { titulo: 'Concluir', destino: COLUNA_FEITO, destaque: true },
      ];
  }
}
