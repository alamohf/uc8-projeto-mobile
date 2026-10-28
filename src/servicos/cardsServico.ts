import { Card } from '../types/entidades';

export interface DadosNovoCard {
  colunaId: number;
  titulo: string;
  descricao: string;
  posicao: number;
}

interface CardRemoto {
  id: number;
  coluna_id: number;
  titulo: string;
  descricao: string | null;
  posicao: number;
  criado_em: string;
}

export class ErroDaApi extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.name = 'ErroDaApi';
    this.status = status;
  }
}

function ehMensagemDeErro(valor: unknown): valor is { message: string } {
  return typeof valor === 'object' && valor !== null && typeof (valor as Record<string, unknown>).message === 'string';
}

async function lerMensagemDeErro(resposta: Response): Promise<string> {
  const corpo: unknown = await resposta.json().catch(() => undefined);
  return ehMensagemDeErro(corpo) ? corpo.message : 'sem detalhe no corpo da resposta';
}

function configuracao(): { url: string; chave: string } {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const chave = process.env.EXPO_PUBLIC_SUPABASE_KEY;
  if (url === undefined || chave === undefined) {
    throw new Error('Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_KEY em .env.local');
  }
  return { url, chave };
}

function ehCardRemoto(valor: unknown): valor is CardRemoto {
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }
  const campos = valor as Record<string, unknown>;
  return (
    typeof campos.id === 'number' &&
    typeof campos.coluna_id === 'number' &&
    typeof campos.titulo === 'string' &&
    typeof campos.posicao === 'number' &&
    typeof campos.criado_em === 'string' &&
    (campos.descricao === null || typeof campos.descricao === 'string')
  );
}

function ehListaDeCards(valor: unknown): valor is CardRemoto[] {
  return Array.isArray(valor) && valor.every(ehCardRemoto);
}

function paraCard(remoto: CardRemoto): Card {
  return {
    id: remoto.id,
    colunaId: remoto.coluna_id,
    titulo: remoto.titulo,
    descricao: remoto.descricao ?? undefined,
    posicao: remoto.posicao,
    criadoEm: new Date(remoto.criado_em),
  };
}

async function requisitar(caminho: string, metodo: 'GET' | 'POST' | 'PATCH' = 'GET', corpo?: object): Promise<unknown> {
  const { url, chave } = configuracao();
  const resposta = await fetch(`${url}/rest/v1/${caminho}`, {
    method: metodo,
    headers: { apikey: chave, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  });
  if (!resposta.ok) {
    throw new ErroDaApi(resposta.status, await lerMensagemDeErro(resposta));
  }
  return resposta.json();
}

export async function buscarCards(): Promise<Card[]> {
  const corpo = await requisitar('cards?select=*&order=id');
  if (!ehListaDeCards(corpo)) {
    throw new Error('Resposta inesperada da API');
  }
  return corpo.map(paraCard);
}

export async function incluirCard(dados: DadosNovoCard): Promise<Card> {
  const corpo = await requisitar('cards?select=*', 'POST', {
    coluna_id: dados.colunaId,
    titulo: dados.titulo,
    descricao: dados.descricao,
    posicao: dados.posicao,
  });
  if (!ehListaDeCards(corpo) || corpo.length !== 1) {
    throw new Error('Resposta inesperada da API');
  }
  return paraCard(corpo[0]);
}

export async function moverCard(id: number, colunaId: number, posicao: number): Promise<Card> {
  const corpo = await requisitar(`cards?select=*&id=eq.${id}`, 'PATCH', { coluna_id: colunaId, posicao });
  if (!ehListaDeCards(corpo) || corpo.length !== 1) {
    throw new Error('Resposta inesperada da API');
  }
  return paraCard(corpo[0]);
}
