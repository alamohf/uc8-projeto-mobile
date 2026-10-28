import React, { useState } from 'react';
import { ActivityIndicator, Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CartaoCard from '../componentes/CartaoCard';
import { nomesColunas, ordemColunas } from '../colunas';
import { useQuadro } from '../contexto/QuadroContexto';
import { registrarErro } from '../erros/erros';
import { rotuloGuardados } from '../contagem';
import type { PropsDaTela } from '../navegacao/rotas';
import { Card } from '../types/entidades';
import { cores, espacamento } from '../tema';

interface SecaoDaColuna {
  colunaId: number;
  data: Card[];
}

function agruparPorColuna(cards: Card[]): SecaoDaColuna[] {
  return ordemColunas.map((colunaId) => ({
    colunaId,
    data: cards.filter((c) => c.colunaId === colunaId).sort((a, b) => a.posicao - b.posicao || a.id - b.id),
  }));
}

export default function TelaQuadro({ navigation }: PropsDaTela<'Quadro'>) {
  const { estado, guardados, recarregar, mover } = useQuadro();
  const [avisoDeErro, setAvisoDeErro] = useState('');

  function moverCard(id: number, colunaId: number) {
    mover(id, colunaId)
      .then(() => setAvisoDeErro(''))
      .catch((erro: unknown) => setAvisoDeErro(`Não foi possível mover o card. ${registrarErro('mover', erro).mensagem}`));
  }

  function conteudo() {
    switch (estado.tipo) {
      case 'carregando':
        return (
          <View style={styles.centro}>
            <ActivityIndicator size="large" color={cores.destaque} />
            <Text style={styles.textoCarregando}>Carregando cards...</Text>
          </View>
        );
      case 'erro':
        return (
          <View style={styles.centro}>
            <Text style={styles.erro}>Não foi possível carregar os cards.</Text>
            <Text style={styles.detalheDoErro}>{estado.mensagem}</Text>
            <Pressable style={styles.botao} onPress={recarregar}>
              <Text style={styles.textoBotao}>Tentar de novo</Text>
            </Pressable>
          </View>
        );
      case 'pronto':
        return (
          <>
            {estado.origem === 'aparelho' && (
              <View style={styles.avisoOffline}>
                <Text style={styles.textoAvisoOffline}>
                  Sem conexão: mostrando os cards guardados no aparelho ({estado.motivo})
                </Text>
              </View>
            )}
            {estado.pendentes.length > 0 && (
              <View style={styles.avisoOffline}>
                <Text style={styles.textoAvisoOffline}>
                  A enviar ({estado.pendentes.length}): {estado.pendentes.map((pendente) => pendente.titulo).join(', ')}
                </Text>
              </View>
            )}
            <SectionList
              sections={agruparPorColuna(estado.cards)}
              keyExtractor={(card) => String(card.id)}
              renderItem={({ item }) => <CartaoCard card={item} aoMudarColuna={moverCard} aoAbrir={(id) => navigation.navigate('DetalheCard', { id })} />}
              renderSectionHeader={({ section }) => (
                <View style={styles.secao}>
                  <Text style={styles.tituloSecao}>{nomesColunas[section.colunaId]}</Text>
                  <Text style={styles.contagemSecao}>{section.data.length}</Text>
                </View>
              )}
              renderSectionFooter={({ section }) =>
                section.data.length === 0 ? <Text style={styles.vazio}>Nenhum card nesta coluna.</Text> : null
              }
              stickySectionHeadersEnabled={false}
              contentContainerStyle={styles.conteudo}
            />
          </>
        );
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar style="light" />
      <View style={styles.cabecalho}>
        <Text style={styles.tituloCabecalho}>Kanban</Text>
        <Text style={styles.guardados}>Guardados no aparelho: {rotuloGuardados(guardados)}</Text>
        <View style={styles.botoesCabecalho}>
          {estado.tipo === 'pronto' ? (
            <>
              <Pressable style={styles.botaoCabecalho} onPress={() => navigation.navigate('Busca')}>
                <Text style={styles.textoBotaoCabecalho}>Buscar</Text>
              </Pressable>
              <Pressable style={styles.botaoCabecalho} onPress={() => navigation.navigate('NovoCard')}>
                <Text style={styles.textoBotaoCabecalho}>Novo</Text>
              </Pressable>
            </>
          ) : null}
          <Pressable style={styles.botaoCabecalho} onPress={() => navigation.navigate('Sobre')}>
            <Text style={styles.textoBotaoCabecalho}>Sobre</Text>
          </Pressable>
        </View>
      </View>
      {avisoDeErro !== '' ? (
        <Pressable style={styles.aviso} onPress={() => setAvisoDeErro('')}>
          <Text style={styles.textoAviso}>{avisoDeErro}</Text>
          <Text style={styles.dicaAviso}>Toque para fechar</Text>
        </Pressable>
      ) : null}
      {conteudo()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    backgroundColor: cores.verde,
    borderBottomColor: cores.destaque,
    borderBottomWidth: 3,
    paddingHorizontal: espacamento.medio,
    paddingVertical: 14,
  },
  botoesCabecalho: {
    flexDirection: 'row',
    marginTop: 10,
  },
  botaoCabecalho: {
    flex: 1,
    backgroundColor: cores.destaque,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
    marginRight: espacamento.pequeno,
  },
  textoBotaoCabecalho: {
    color: cores.textoSobreDestaque,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tituloCabecalho: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: '800',
  },
  guardados: {
    color: cores.texto,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
  conteudo: {
    padding: espacamento.medio,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: espacamento.medio,
  },
  textoCarregando: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: espacamento.medio,
  },
  aviso: {
    backgroundColor: cores.superficie,
    borderLeftColor: cores.erro,
    borderLeftWidth: 4,
    marginHorizontal: espacamento.medio,
    marginTop: espacamento.medio,
    padding: espacamento.medio,
    borderRadius: 8,
  },
  textoAviso: {
    color: cores.erro,
    fontSize: 14,
    fontWeight: '700',
  },
  avisoOffline: {
    backgroundColor: cores.superficie,
    borderLeftColor: cores.destaque,
    borderLeftWidth: 4,
    marginHorizontal: espacamento.medio,
    marginTop: espacamento.medio,
    padding: espacamento.medio,
    borderRadius: 8,
  },
  textoAvisoOffline: {
    color: cores.destaque,
    fontSize: 13,
    fontWeight: '700',
  },
  dicaAviso: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 4,
  },
  erro: {
    color: cores.erro,
    fontSize: 16,
    fontWeight: '700',
  },
  detalheDoErro: {
    color: cores.textoSecundario,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: espacamento.pequeno,
  },
  botao: {
    backgroundColor: cores.destaque,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: espacamento.grande,
    marginTop: espacamento.pequeno,
  },
  textoBotao: {
    color: cores.textoSobreDestaque,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  secao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: espacamento.pequeno,
    marginBottom: espacamento.pequeno,
  },
  tituloSecao: {
    color: cores.destaque,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  contagemSecao: {
    color: cores.textoSecundario,
    fontSize: 13,
    fontWeight: '700',
  },
  vazio: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginBottom: espacamento.medio,
  },
});
