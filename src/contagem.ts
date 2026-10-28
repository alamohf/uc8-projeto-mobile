export function rotuloGuardados(guardados: number | 'indisponivel' | undefined): string {
  if (guardados === undefined) {
    return '...';
  }
  return guardados === 'indisponivel' ? 'indisponível' : String(guardados);
}
