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
import { cores, espacamento, estiloDaColuna, estiloSemColuna, raios } from '../tema';

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
            <ActivityIndicator size="large" color={cores.primaria} />
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
              renderSectionHeader={({ section }) => {
                const estiloColuna = estiloDaColuna[section.colunaId] ?? estiloSemColuna;
                return (
                  <View style={styles.secao}>
                    <Text style={styles.tituloSecao}>{nomesColunas[section.colunaId]}</Text>
                    <View style={[styles.pilula, { backgroundColor: estiloColuna.tinta }]}>
                      <Text style={[styles.contagemSecao, { color: estiloColuna.cor }]}>{section.data.length}</Text>
                    </View>
                  </View>
                );
              }}
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
        <View style={styles.titulos}>
          <Text style={styles.tituloCabecalho}>Kanban</Text>
          <Text style={styles.guardados}>Guardados no aparelho: {rotuloGuardados(guardados)}</Text>
        </View>
        <View style={styles.botoesCabecalho}>
          {estado.tipo === 'pronto' ? (
            <Pressable style={styles.botaoCabecalho} onPress={() => navigation.navigate('Busca')}>
              <Text style={styles.textoBotaoCabecalho}>Buscar</Text>
            </Pressable>
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
      {estado.tipo === 'pronto' ? (
        <Pressable style={styles.botaoFlutuante} onPress={() => navigation.navigate('NovoCard')}>
          <Text style={styles.maisFlutuante}>+</Text>
          <Text style={styles.textoBotaoFlutuante}>Novo</Text>
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: cores.superficie,
    borderBottomColor: cores.borda,
    borderBottomWidth: 1,
    paddingHorizontal: espacamento.medio,
    paddingVertical: espacamento.md,
  },
  titulos: {
    flex: 1,
  },
  botoesCabecalho: {
    flexDirection: 'row',
  },
  botaoCabecalho: {
    backgroundColor: cores.cartao,
    borderColor: cores.bordaForte,
    borderWidth: 1,
    borderRadius: raios.campo,
    paddingVertical: espacamento.pequeno,
    paddingHorizontal: espacamento.md,
    marginLeft: espacamento.pequeno,
  },
  textoBotaoCabecalho: {
    color: cores.texto,
    fontSize: 13,
    fontWeight: '600',
  },
  tituloCabecalho: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: '700',
  },
  guardados: {
    color: cores.textoSecundario,
    fontSize: 12,
    marginTop: 2,
  },
  conteudo: {
    padding: espacamento.medio,
    paddingBottom: 96,
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
    backgroundColor: cores.cartao,
    borderLeftColor: cores.erro,
    borderLeftWidth: 4,
    marginHorizontal: espacamento.medio,
    marginTop: espacamento.medio,
    padding: espacamento.medio,
    borderRadius: raios.cartao,
  },
  textoAviso: {
    color: cores.erro,
    fontSize: 14,
    fontWeight: '700',
  },
  avisoOffline: {
    backgroundColor: cores.cartao,
    borderLeftColor: cores.alerta,
    borderLeftWidth: 4,
    marginHorizontal: espacamento.medio,
    marginTop: espacamento.medio,
    padding: espacamento.medio,
    borderRadius: raios.cartao,
  },
  textoAvisoOffline: {
    color: cores.alerta,
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
    backgroundColor: cores.primaria,
    borderRadius: raios.campo,
    paddingVertical: 12,
    paddingHorizontal: espacamento.grande,
    marginTop: espacamento.pequeno,
  },
  textoBotao: {
    color: cores.textoSobrePrimaria,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  secao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: espacamento.pequeno,
    marginBottom: espacamento.pequeno,
  },
  tituloSecao: {
    color: cores.texto,
    fontSize: 15,
    fontWeight: '600',
  },
  pilula: {
    borderRadius: raios.pilula,
    paddingHorizontal: espacamento.pequeno,
    paddingVertical: 2,
    marginLeft: espacamento.pequeno,
  },
  contagemSecao: {
    fontSize: 11,
    fontWeight: '700',
  },
  vazio: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginBottom: espacamento.medio,
  },
  botaoFlutuante: {
    position: 'absolute',
    right: espacamento.medio,
    bottom: espacamento.grande,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.primaria,
    borderRadius: raios.pilula,
    height: 48,
    paddingHorizontal: espacamento.medio + 4,
    elevation: 6,
    shadowColor: cores.primaria,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  maisFlutuante: {
    color: cores.textoSobrePrimaria,
    fontSize: 22,
    fontWeight: '600',
    marginRight: espacamento.pequeno,
  },
  textoBotaoFlutuante: {
    color: cores.textoSobrePrimaria,
    fontSize: 14,
    fontWeight: '700',
  },
});
