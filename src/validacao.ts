import { ErroDeValidacao } from './erros/erros';

export const TAMANHO_MAXIMO_TITULO = 80;

export function mensagemDoCard(titulo: string, descricao: string): string | undefined {
  const tituloLimpo = titulo.trim();
  if (tituloLimpo === '' || descricao.trim() === '') {
    return 'Preencha título e descrição.';
  }
  if (tituloLimpo.length > TAMANHO_MAXIMO_TITULO) {
    return `O título pode ter até ${TAMANHO_MAXIMO_TITULO} caracteres.`;
  }
  return undefined;
}

export function validarNovoCard(titulo: string, descricao: string): void {
  const mensagem = mensagemDoCard(titulo, descricao);
  if (mensagem !== undefined) {
    throw new ErroDeValidacao(mensagem);
  }
}
