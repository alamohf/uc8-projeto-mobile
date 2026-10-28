import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Card } from '../types/entidades';
import { acoesDaColuna } from '../acoes';
import { COLUNA_FEITO, nomesColunas } from '../colunas';
import { cores, espacamento } from '../tema';

interface CartaoCardProps {
  card: Card;
  aoMudarColuna: (id: number, colunaId: number) => void;
  aoAbrir: (id: number) => void;
}

export default function CartaoCard({ card, aoMudarColuna, aoAbrir }: CartaoCardProps) {
  const concluido = card.colunaId === COLUNA_FEITO;

  function mudarColuna(swipeable: SwipeableMethods, colunaId: number) {
    swipeable.close();
    aoMudarColuna(card.id, colunaId);
  }

  function renderAcoes(_progress: unknown, _translation: unknown, swipeable: SwipeableMethods) {
    const acoes = acoesDaColuna(card.colunaId);
    return (
      <View style={styles.acoes}>
        {acoes.map((acao, indice) => (
          <Pressable
            key={acao.titulo}
            style={[
              styles.acao,
              acao.destaque ? styles.acaoDestaque : styles.acaoVerde,
              indice === acoes.length - 1 && styles.acaoUltima,
            ]}
            onPress={() => mudarColuna(swipeable, acao.destino)}
          >
            <Text style={acao.destaque ? styles.textoAcaoEscuro : styles.textoAcao}>{acao.titulo}</Text>
          </Pressable>
        ))}
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
        <Pressable
          style={[styles.cartao, concluido && styles.cartaoConcluido]}
          onPress={() => aoAbrir(card.id)}
        >
          <Text style={[styles.titulo, concluido && styles.tituloConcluido]}>{card.titulo}</Text>
          {card.descricao ? <Text style={styles.descricao}>{card.descricao}</Text> : null}
          <View style={styles.rodape}>
            <Text style={styles.coluna}>{nomesColunas[card.colunaId] ?? 'Sem coluna'}</Text>
            <Text style={styles.data}>{card.criadoEm.toLocaleDateString('pt-BR')}</Text>
          </View>
        </Pressable>
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
  acaoVerde: {
    backgroundColor: cores.verde,
  },
  acaoDestaque: {
    backgroundColor: cores.destaque,
  },
  acaoUltima: {
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
