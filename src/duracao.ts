const MS_POR_DIA = 24 * 60 * 60 * 1000;

function inicioDoDia(data: Date): number {
  return Date.UTC(data.getFullYear(), data.getMonth(), data.getDate());
}

export function diasEntre(inicio: Date, fim: Date): number {
  return Math.max(0, Math.round((inicioDoDia(fim) - inicioDoDia(inicio)) / MS_POR_DIA));
}

export function rotuloDuracao(dias: number): string {
  if (dias === 0) {
    return 'no mesmo dia';
  }
  return dias === 1 ? '1 dia' : `${dias} dias`;
}
