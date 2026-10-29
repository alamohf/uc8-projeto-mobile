import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Card } from '../types/entidades';
import { acoesDaColuna } from '../acoes';
import { COLUNA_FEITO, nomesColunas } from '../colunas';
import { diasEntre, rotuloDuracao } from '../duracao';
import { cores, espacamento, estiloDaColuna, estiloSemColuna, raios } from '../tema';

interface CartaoCardProps {
  card: Card;
  aoMudarColuna: (id: number, colunaId: number) => void;
  aoAbrir: (id: number) => void;
}

export default function CartaoCard({ card, aoMudarColuna, aoAbrir }: CartaoCardProps) {
  const concluido = card.colunaId === COLUNA_FEITO;
  const estiloColuna = estiloDaColuna[card.colunaId] ?? estiloSemColuna;

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
              acao.destaque ? styles.acaoDestaque : styles.acaoSecundaria,
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
            <View style={[styles.selo, { backgroundColor: estiloColuna.tinta }]}>
              <View style={[styles.ponto, { backgroundColor: estiloColuna.cor }]} />
              <Text style={[styles.coluna, { color: estiloColuna.cor }]}>{nomesColunas[card.colunaId] ?? 'Sem coluna'}</Text>
            </View>
            <View style={styles.datas}>
              <Text style={styles.data}>{card.criadoEm.toLocaleDateString('pt-BR')}</Text>
              {concluido && card.concluidoEm !== undefined ? (
                <Text style={styles.duracao}>Levou {rotuloDuracao(diasEntre(card.criadoEm, card.concluidoEm))}</Text>
              ) : null}
            </View>
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
    backgroundColor: cores.cartao,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raios.cartao,
    padding: espacamento.md,
  },
  cartaoConcluido: {
    backgroundColor: cores.superficie,
  },
  titulo: {
    color: cores.texto,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  tituloConcluido: {
    color: cores.textoSecundario,
    textDecorationLine: 'line-through',
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: 13,
    lineHeight: 18,
    marginTop: espacamento.xs,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: espacamento.md,
  },
  selo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: raios.selo,
    paddingHorizontal: espacamento.pequeno,
    paddingVertical: espacamento.xs,
  },
  ponto: {
    width: 6,
    height: 6,
    borderRadius: raios.pilula,
    marginRight: 6,
  },
  coluna: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  datas: {
    alignItems: 'flex-end',
  },
  data: {
    color: cores.textoSecundario,
    fontSize: 12,
  },
  duracao: {
    color: cores.sucesso,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
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
  acaoSecundaria: {
    backgroundColor: cores.cartaoAtivo,
  },
  acaoDestaque: {
    backgroundColor: cores.primaria,
  },
  acaoUltima: {
    borderTopRightRadius: raios.cartao,
    borderBottomRightRadius: raios.cartao,
  },
  textoAcao: {
    color: cores.texto,
    fontSize: 13,
    fontWeight: '700',
  },
  textoAcaoEscuro: {
    color: cores.textoSobrePrimaria,
    fontSize: 13,
    fontWeight: '700',
  },
});
