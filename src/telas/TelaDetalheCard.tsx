import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { acoesDaColuna } from '../acoes';
import { COLUNA_FEITO, nomesColunas } from '../colunas';
import { useQuadro } from '../contexto/QuadroContexto';
import { registrarErro } from '../erros/erros';
import type { PropsDaTela } from '../navegacao/rotas';
import { cores, espacamento, estiloDaColuna, estiloSemColuna, raios } from '../tema';

export default function TelaDetalheCard({ route }: PropsDaTela<'DetalheCard'>) {
  const { estado, mover } = useQuadro();
  const [avisoDeErro, setAvisoDeErro] = useState('');

  const card = estado.tipo === 'pronto' ? estado.cards.find((c) => c.id === route.params.id) : undefined;

  if (card === undefined) {
    return (
      <View style={styles.centro}>
        <Text style={styles.vazio}>Card não encontrado.</Text>
      </View>
    );
  }

  const concluido = card.colunaId === COLUNA_FEITO;
  const estiloColuna = estiloDaColuna[card.colunaId] ?? estiloSemColuna;

  function moverPara(colunaId: number) {
    mover(route.params.id, colunaId)
      .then(() => setAvisoDeErro(''))
      .catch((erro: unknown) => setAvisoDeErro(`Não foi possível mover o card. ${registrarErro('mover', erro).mensagem}`));
  }

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      <Text style={[styles.titulo, concluido && styles.tituloConcluido]}>{card.titulo}</Text>
      <Text style={styles.descricao}>{card.descricao ?? 'Sem descrição.'}</Text>
      <View style={styles.linha}>
        <Text style={styles.rotulo}>Coluna</Text>
        <Text style={[styles.coluna, { color: estiloColuna.cor }]}>{nomesColunas[card.colunaId] ?? 'Sem coluna'}</Text>
      </View>
      <View style={styles.linha}>
        <Text style={styles.rotulo}>Criado em</Text>
        <Text style={styles.valor}>{card.criadoEm.toLocaleDateString('pt-BR')}</Text>
      </View>
      {avisoDeErro !== '' ? <Text style={styles.erro}>{avisoDeErro}</Text> : null}
      <View style={styles.acoes}>
        {acoesDaColuna(card.colunaId).map((acao) => (
          <Pressable
            key={acao.titulo}
            style={[styles.acao, acao.destaque ? styles.acaoDestaque : styles.acaoSecundaria]}
            onPress={() => moverPara(acao.destino)}
          >
            <Text style={acao.destaque ? styles.textoAcaoEscuro : styles.textoAcao}>{acao.titulo}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: espacamento.medio,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espacamento.medio,
  },
  vazio: {
    color: cores.textoSecundario,
    fontSize: 16,
  },
  titulo: {
    color: cores.texto,
    fontSize: 22,
    fontWeight: '800',
  },
  tituloConcluido: {
    textDecorationLine: 'line-through',
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: 16,
    marginTop: espacamento.pequeno,
    marginBottom: espacamento.medio,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: cores.borda,
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  rotulo: {
    color: cores.textoSecundario,
    fontSize: 14,
  },
  coluna: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  valor: {
    color: cores.texto,
    fontSize: 14,
  },
  erro: {
    color: cores.erro,
    fontSize: 14,
    fontWeight: '700',
    marginTop: espacamento.pequeno,
  },
  acoes: {
    flexDirection: 'row',
    marginTop: espacamento.grande,
  },
  acao: {
    flex: 1,
    borderRadius: raios.campo,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: espacamento.pequeno,
  },
  acaoSecundaria: {
    backgroundColor: cores.cartaoAtivo,
  },
  acaoDestaque: {
    backgroundColor: cores.primaria,
  },
  textoAcao: {
    color: cores.texto,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  textoAcaoEscuro: {
    color: cores.textoSobrePrimaria,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
