import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { buscarCards, descreverErro, incluirCard, moverCard } from '../servicos/cardsServico';
import { Card } from '../types/entidades';
import { COLUNA_FAZER } from '../colunas';

export type EstadoQuadro =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'pronto'; cards: Card[] };

interface ValorDoQuadro {
  estado: EstadoQuadro;
  recarregar: () => void;
  incluir: (titulo: string, descricao: string) => Promise<Card>;
  mover: (id: number, colunaId: number) => Promise<Card>;
}

const QuadroContexto = createContext<ValorDoQuadro | undefined>(undefined);

export function QuadroProvedor({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoQuadro>({ tipo: 'carregando' });
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let cancelado = false;
    setEstado({ tipo: 'carregando' });
    buscarCards()
      .then((cards) => {
        if (!cancelado) {
          setEstado({ tipo: 'pronto', cards });
        }
      })
      .catch((erro: unknown) => {
        if (!cancelado) {
          setEstado({ tipo: 'erro', mensagem: descreverErro(erro) });
        }
      });
    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  function recarregar() {
    setTentativa(tentativa + 1);
  }

  async function incluir(titulo: string, descricao: string): Promise<Card> {
    const existentes = estado.tipo === 'pronto' ? estado.cards : [];
    const posicao = Math.max(0, ...existentes.map((c) => c.posicao)) + 1;
    const novo = await incluirCard({ colunaId: COLUNA_FAZER, titulo, descricao, posicao });
    setEstado((atual) => (atual.tipo === 'pronto' ? { tipo: 'pronto', cards: [...atual.cards, novo] } : atual));
    return novo;
  }

  async function mover(id: number, colunaId: number): Promise<Card> {
    const atualizado = await moverCard(id, colunaId);
    setEstado((atual) =>
      atual.tipo === 'pronto'
        ? { tipo: 'pronto', cards: atual.cards.map((c) => (c.id === id ? atualizado : c)) }
        : atual,
    );
    return atualizado;
  }

  return <QuadroContexto.Provider value={{ estado, recarregar, incluir, mover }}>{children}</QuadroContexto.Provider>;
}

export function useQuadro(): ValorDoQuadro {
  const valor = useContext(QuadroContexto);
  if (valor === undefined) {
    throw new Error('useQuadro só funciona dentro de QuadroProvedor');
  }
  return valor;
}
