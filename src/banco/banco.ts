import * as SQLite from 'expo-sqlite';
import { Card } from '../types/entidades';

interface LinhaCard {
  id: number;
  coluna_id: number;
  titulo: string;
  descricao: string | null;
  posicao: number;
  criado_em: string;
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
