import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import {
  contarLocal,
  guardarLocal,
  guardarPendente,
  listarLocal,
  listarPendentes,
  removerPendente,
  type Pendente,
} from '../banco/banco';
import { registrarErro } from '../erros/erros';
import { ErroDaApi, buscarCards, incluirCard, moverCard } from '../servicos/cardsServico';
import { Card } from '../types/entidades';
import { COLUNA_FAZER, COLUNA_FEITO } from '../colunas';
import { validarNovoCard } from '../validacao';

export type EstadoQuadro =
  | { tipo: 'carregando' }
  | { tipo: 'erro'; mensagem: string }
  | { tipo: 'pronto'; cards: Card[]; pendentes: Pendente[]; origem: 'nuvem' }
  | { tipo: 'pronto'; cards: Card[]; pendentes: Pendente[]; origem: 'aparelho'; motivo: string };

interface ValorDoQuadro {
  estado: EstadoQuadro;
  guardados: number | 'indisponivel' | undefined;
  atualizando: boolean;
  recarregar: () => void;
  incluir: (titulo: string, descricao: string) => Promise<void>;
  mover: (id: number, colunaId: number) => Promise<Card>;
}

const QuadroContexto = createContext<ValorDoQuadro | undefined>(undefined);

async function sincronizar(): Promise<void> {
  for (const pendente of await listarPendentes()) {
    try {
      await incluirCard(pendente);
    } catch (erro: unknown) {
      if (erro instanceof ErroDaApi) {
        registrarErro('pendente descartado', erro);
      } else {
        return;
      }
    }
    await removerPendente(pendente.id);
  }
}

export function QuadroProvedor({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoQuadro>({ tipo: 'carregando' });
  const [guardados, setGuardados] = useState<number | 'indisponivel' | undefined>(undefined);
  const [tentativa, setTentativa] = useState(0);
  const [atualizando, setAtualizando] = useState(false);
  const estadoAtual = useRef(estado);
  estadoAtual.current = estado;

  function guardarNoAparelho(cards: Card[]) {
    guardarLocal(cards)
      .then(() => contarLocal())
      .then(setGuardados)
      .catch((erro: unknown) => {
        registrarErro('guardar', erro);
        setGuardados('indisponivel');
      });
  }

  useEffect(() => {
    let cancelado = false;
    setAtualizando(true);
    setEstado((atual) => (atual.tipo === 'pronto' ? atual : { tipo: 'carregando' }));
    sincronizar()
      .catch((erro: unknown) => {
        registrarErro('sincronizar', erro);
      })
      .then(() => buscarCards())
      .then(async (cards) => {
        const pendentes = await listarPendentes().catch((erro: unknown) => {
          registrarErro('pendentes', erro);
          return [];
        });
        if (!cancelado) {
          setEstado({ tipo: 'pronto', cards, pendentes, origem: 'nuvem' });
        }
        guardarNoAparelho(cards);
      })
      .catch((erro: unknown) => {
        const motivo = registrarErro('carga', erro).mensagem;
        return Promise.all([listarLocal(), listarPendentes()])
          .then(([guardadosLocal, pendentes]) => {
            if (cancelado) {
              return;
            }
            if (guardadosLocal.length > 0 || pendentes.length > 0) {
              setGuardados(guardadosLocal.length);
              setEstado({ tipo: 'pronto', cards: guardadosLocal, pendentes, origem: 'aparelho', motivo });
            } else {
              setEstado({ tipo: 'erro', mensagem: motivo });
            }
          })
          .catch((erroLocal: unknown) => {
            if (!cancelado) {
              setEstado({ tipo: 'erro', mensagem: `${motivo} ${registrarErro('local', erroLocal).mensagem}` });
            }
          });
      })
      .finally(() => {
        if (!cancelado) {
          setAtualizando(false);
        }
      });
    return () => {
      cancelado = true;
    };
  }, [tentativa]);

  useEffect(() => {
    const assinatura = AppState.addEventListener('change', (proximo) => {
      const atual = estadoAtual.current;
      const desatualizado =
        atual.tipo === 'erro' || (atual.tipo === 'pronto' && (atual.origem === 'aparelho' || atual.pendentes.length > 0));
      if (proximo === 'active' && desatualizado) {
        setTentativa((anterior) => anterior + 1);
      }
    });
    return () => assinatura.remove();
  }, []);

  function recarregar() {
    setTentativa(tentativa + 1);
  }

  async function incluir(titulo: string, descricao: string): Promise<void> {
    validarNovoCard(titulo, descricao);
    const existentes = estado.tipo === 'pronto' ? estado.cards : [];
    const posicao = Math.max(0, ...existentes.map((c) => c.posicao)) + 1;
    const dados = { colunaId: COLUNA_FAZER, titulo, descricao, posicao };
    try {
      const novo = await incluirCard(dados);
      setEstado((atual) => (atual.tipo === 'pronto' ? { ...atual, cards: [...atual.cards, novo] } : atual));
      guardarNoAparelho([...existentes, novo]);
    } catch (erro: unknown) {
      if (erro instanceof ErroDaApi) {
        throw erro;
      }
      const pendente = await guardarPendente(dados);
      setEstado((atual) =>
        atual.tipo === 'pronto' ? { ...atual, pendentes: [...atual.pendentes, pendente] } : atual,
      );
    }
  }

  async function mover(id: number, colunaId: number): Promise<Card> {
    const existentes = estado.tipo === 'pronto' ? estado.cards : [];
    const doDestino = existentes.filter((c) => c.colunaId === colunaId);
    const posicao = Math.max(0, ...doDestino.map((c) => c.posicao)) + 1;
    const concluidoEm = colunaId === COLUNA_FEITO ? new Date() : null;
    const atualizado = await moverCard(id, colunaId, posicao, concluidoEm);
    setEstado((atual) =>
      atual.tipo === 'pronto'
        ? { ...atual, cards: atual.cards.map((c) => (c.id === id ? atualizado : c)) }
        : atual,
    );
    guardarNoAparelho(existentes.map((c) => (c.id === id ? atualizado : c)));
    return atualizado;
  }

  return <QuadroContexto.Provider value={{ estado, guardados, atualizando, recarregar, incluir, mover }}>{children}</QuadroContexto.Provider>;
}

export function useQuadro(): ValorDoQuadro {
  const valor = useContext(QuadroContexto);
  if (valor === undefined) {
    throw new Error('useQuadro só funciona dentro de QuadroProvedor');
  }
  return valor;
}
