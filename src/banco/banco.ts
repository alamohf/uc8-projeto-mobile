import * as SQLite from 'expo-sqlite';
import type { DadosNovoCard } from '../servicos/cardsServico';
import { Card } from '../types/entidades';

export interface Pendente extends DadosNovoCard {
  id: number;
}

interface LinhaCard {
  id: number;
  coluna_id: number;
  titulo: string;
  descricao: string | null;
  posicao: number;
  criado_em: string;
}

interface LinhaPendente {
  id: number;
  coluna_id: number;
  titulo: string;
  descricao: string;
  posicao: number;
}

let bancoAberto: Promise<SQLite.SQLiteDatabase> | undefined;

function banco(): Promise<SQLite.SQLiteDatabase> {
  if (bancoAberto === undefined) {
    bancoAberto = SQLite.openDatabaseAsync('kanban.db').then(async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS cards (
          id INTEGER PRIMARY KEY NOT NULL,
          coluna_id INTEGER NOT NULL,
          titulo TEXT NOT NULL,
          descricao TEXT,
          posicao INTEGER NOT NULL,
          criado_em TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS pendentes (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          coluna_id INTEGER NOT NULL,
          titulo TEXT NOT NULL,
          descricao TEXT NOT NULL,
          posicao INTEGER NOT NULL
        );
      `);
      return db;
    });
  }
  return bancoAberto;
}

function paraCard(linha: LinhaCard): Card {
  return {
    id: linha.id,
    colunaId: linha.coluna_id,
    titulo: linha.titulo,
    descricao: linha.descricao ?? undefined,
    posicao: linha.posicao,
    criadoEm: new Date(linha.criado_em),
  };
}

export async function listarLocal(): Promise<Card[]> {
  const db = await banco();
  const linhas = await db.getAllAsync<LinhaCard>(
    'SELECT id, coluna_id, titulo, descricao, posicao, criado_em FROM cards ORDER BY id',
  );
  return linhas.map(paraCard);
}

export async function guardarLocal(cards: Card[]): Promise<void> {
  const db = await banco();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM cards');
    for (const card of cards) {
      await db.runAsync(
        'INSERT INTO cards (id, coluna_id, titulo, descricao, posicao, criado_em) VALUES (?, ?, ?, ?, ?, ?)',
        [card.id, card.colunaId, card.titulo, card.descricao ?? null, card.posicao, card.criadoEm.toISOString()],
      );
    }
  });
}

export async function contarLocal(): Promise<number> {
  const db = await banco();
  const linha = await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM cards');
  return linha?.total ?? 0;
}

function paraPendente(linha: LinhaPendente): Pendente {
  return {
    id: linha.id,
    colunaId: linha.coluna_id,
    titulo: linha.titulo,
    descricao: linha.descricao,
    posicao: linha.posicao,
  };
}

export async function listarPendentes(): Promise<Pendente[]> {
  const db = await banco();
  const linhas = await db.getAllAsync<LinhaPendente>(
    'SELECT id, coluna_id, titulo, descricao, posicao FROM pendentes ORDER BY id',
  );
  return linhas.map(paraPendente);
}

export async function guardarPendente(dados: DadosNovoCard): Promise<Pendente> {
  const db = await banco();
  const resultado = await db.runAsync(
    'INSERT INTO pendentes (coluna_id, titulo, descricao, posicao) VALUES (?, ?, ?, ?)',
    [dados.colunaId, dados.titulo, dados.descricao, dados.posicao],
  );
  return { id: resultado.lastInsertRowId, ...dados };
}

export async function removerPendente(id: number): Promise<void> {
  const db = await banco();
  await db.runAsync('DELETE FROM pendentes WHERE id = ?', [id]);
}
