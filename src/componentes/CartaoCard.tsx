import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Card } from '../types/entidades';
import { COLUNA_FAZER, COLUNA_FEITO, nomesColunas } from '../colunas';
import { cores, espacamento } from '../tema';

interface CartaoCardProps {
  card: Card;
  aoMudarColuna: (id: number, colunaId: number) => void;
}

export default function CartaoCard({ card, aoMudarColuna }: CartaoCardProps) {
  const concluido = card.colunaId === COLUNA_FEITO;

  function mudarColuna(swipeable: SwipeableMethods, colunaId: number) {
    swipeable.close();
    aoMudarColuna(card.id, colunaId);
  }

  function renderAcoes(_progress: unknown, _translation: unknown, swipeable: SwipeableMethods) {
    return (
      <View style={styles.acoes}>
        {concluido ? (
          <Pressable
            style={[styles.acao, styles.acaoReabrir]}
            onPress={() => mudarColuna(swipeable, COLUNA_FAZER)}
          >
            <Text style={styles.textoAcao}>Reabrir</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              style={[styles.acao, styles.acaoMover]}
              onPress={() => mudarColuna(swipeable, card.colunaId + 1)}
            >
              <Text style={styles.textoAcao}>Mover</Text>
            </Pressable>
            <Pressable
              style={[styles.acao, styles.acaoConcluir]}
              onPress={() => mudarColuna(swipeable, COLUNA_FEITO)}
            >
              <Text style={styles.textoAcaoEscuro}>Concluir</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.espaco}>
      <ReanimatedSwipeable
        renderRightActions={renderAcoes}
        rightThreshold={40}
        overshootRight={false}
      >
        <View style={[styles.cartao, concluido && styles.cartaoConcluido]}>
          <Text style={[styles.titulo, concluido && styles.tituloConcluido]}>{card.titulo}</Text>
          {card.descricao ? <Text style={styles.descricao}>{card.descricao}</Text> : null}
          <View style={styles.rodape}>
            <Text style={styles.coluna}>{nomesColunas[card.colunaId] ?? 'Sem coluna'}</Text>
            <Text style={styles.data}>{card.criadoEm.toLocaleDateString('pt-BR')}</Text>
          </View>
        </View>
      </ReanimatedSwipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  espaco: {
    marginBottom: espacamento.pequeno,
  },
  cartao: {
    backgroundColor: cores.superficie,
    borderLeftWidth: 4,
    borderLeftColor: cores.verde,
    borderRadius: 8,
    padding: espacamento.medio,
  },
  cartaoConcluido: {
    borderLeftColor: cores.destaque,
    opacity: 0.7,
  },
  titulo: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  tituloConcluido: {
    textDecorationLine: 'line-through',
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: 4,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: espacamento.pequeno,
  },
  coluna: {
    color: cores.destaque,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  data: {
    color: cores.textoSecundario,
    fontSize: 12,
  },
  acoes: {
    flexDirection: 'row',
    marginLeft: espacamento.pequeno,
  },
  acao: {
    width: 84,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acaoMover: {
    backgroundColor: cores.verde,
  },
  acaoConcluir: {
    backgroundColor: cores.destaque,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  acaoReabrir: {
    backgroundColor: cores.verde,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  textoAcao: {
    color: cores.texto,
    fontSize: 13,
    fontWeight: '700',
  },
  textoAcaoEscuro: {
    color: cores.textoSobreDestaque,
    fontSize: 13,
    fontWeight: '700',
  },
});
