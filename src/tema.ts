import { COLUNA_FAZENDO, COLUNA_FAZER, COLUNA_FEITO } from './colunas';

export const cores = {
  fundo: '#0B0F19',
  superficie: '#0F172A',
  cartao: '#1E293B',
  cartaoAtivo: '#273549',
  borda: 'rgba(255, 255, 255, 0.06)',
  bordaForte: '#334155',
  primaria: '#06B6D4',
  textoSobrePrimaria: '#0F172A',
  sucesso: '#10B981',
  sucessoTinta: 'rgba(16, 185, 129, 0.12)',
  alerta: '#F59E0B',
  alertaTinta: 'rgba(245, 158, 11, 0.12)',
  pendente: '#A855F7',
  pendenteTinta: 'rgba(168, 85, 247, 0.12)',
  erro: '#F43F5E',
  texto: '#F8FAFC',
  textoSecundario: '#94A3B8',
};

export const espacamento = {
  xs: 4,
  pequeno: 8,
  md: 12,
  medio: 16,
  grande: 24,
};

export const raios = {
  selo: 6,
  campo: 12,
  cartao: 12,
  pilula: 9999,
};

export const estiloDaColuna: Record<number, { cor: string; tinta: string }> = {
  [COLUNA_FAZER]: { cor: cores.pendente, tinta: cores.pendenteTinta },
  [COLUNA_FAZENDO]: { cor: cores.alerta, tinta: cores.alertaTinta },
  [COLUNA_FEITO]: { cor: cores.sucesso, tinta: cores.sucessoTinta },
};

export const estiloSemColuna = { cor: cores.textoSecundario, tinta: cores.cartaoAtivo };
