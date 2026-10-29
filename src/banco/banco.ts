import * as SQLite from 'expo-sqlite';
import { ErroDoBanco } from '../erros/erros';
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
  concluido_em: string | null;
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
          criado_em TEXT NOT NULL,
          concluido_em TEXT
        );
        CREATE TABLE IF NOT EXISTS pendentes (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          coluna_id INTEGER NOT NULL,
          titulo TEXT NOT NULL,
          descricao TEXT NOT NULL,
          posicao INTEGER NOT NULL
        );
      `);
      const colunas = await db.getAllAsync<{ name: string }>('PRAGMA table_info(cards)');
      if (!colunas.some((coluna) => coluna.name === 'concluido_em')) {
        await db.execAsync('ALTER TABLE cards ADD COLUMN concluido_em TEXT');
      }
      return db;
    });
    bancoAberto.catch(() => {
      bancoAberto = undefined;
    });
  }
  return bancoAberto;
}

async function noBanco<T>(operacao: (db: SQLite.SQLiteDatabase) => Promise<T>): Promise<T> {
  try {
    const db = await banco();
    return await operacao(db);
  } catch (erro: unknown) {
    throw new ErroDoBanco(erro instanceof Error ? erro.message : String(erro));
  }
}

function paraCard(linha: LinhaCard): Card {
  return {
    id: linha.id,
    colunaId: linha.coluna_id,
    titulo: linha.titulo,
    descricao: linha.descricao ?? undefined,
    posicao: linha.posicao,
    criadoEm: new Date(linha.criado_em),
    concluidoEm: linha.concluido_em === null ? undefined : new Date(linha.concluido_em),
  };
}

export async function listarLocal(): Promise<Card[]> {
  const linhas = await noBanco((db) =>
    db.getAllAsync<LinhaCard>('SELECT id, coluna_id, titulo, descricao, posicao, criado_em, concluido_em FROM cards ORDER BY id'),
  );
  return linhas.map(paraCard);
}

export async function guardarLocal(cards: Card[]): Promise<void> {
  await noBanco((db) =>
    db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM cards');
      for (const card of cards) {
        await db.runAsync(
          'INSERT INTO cards (id, coluna_id, titulo, descricao, posicao, criado_em, concluido_em) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [
            card.id,
            card.colunaId,
            card.titulo,
            card.descricao ?? null,
            card.posicao,
            card.criadoEm.toISOString(),
            card.concluidoEm?.toISOString() ?? null,
          ],
        );
      }
    }),
  );
}

export async function contarLocal(): Promise<number> {
  const linha = await noBanco((db) => db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM cards'));
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
  const linhas = await noBanco((db) =>
    db.getAllAsync<LinhaPendente>('SELECT id, coluna_id, titulo, descricao, posicao FROM pendentes ORDER BY id'),
  );
  return linhas.map(paraPendente);
}

export async function guardarPendente(dados: DadosNovoCard): Promise<Pendente> {
  const resultado = await noBanco((db) =>
    db.runAsync('INSERT INTO pendentes (coluna_id, titulo, descricao, posicao) VALUES (?, ?, ?, ?)', [
      dados.colunaId,
      dados.titulo,
      dados.descricao,
      dados.posicao,
    ]),
  );
  return { id: resultado.lastInsertRowId, ...dados };
}

export async function removerPendente(id: number): Promise<void> {
  await noBanco((db) => db.runAsync('DELETE FROM pendentes WHERE id = ?', [id]));
}
