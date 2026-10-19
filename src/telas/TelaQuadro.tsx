import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import CartaoCard from '../componentes/CartaoCard';
import FormularioCard from '../componentes/FormularioCard';
import { useQuadro } from '../contexto/QuadroContexto';
import { descreverErro } from '../servicos/cardsServico';
import { cores, espacamento } from '../tema';

export default function TelaQuadro() {
  const { estado, recarregar, incluir, mover } = useQuadro();

  function conteudo() {
    switch (estado.tipo) {
      case 'carregando':
        return (
          <View style={styles.centro}>
            <ActivityIndicator size="large" color={cores.destaque} />
            <Text style={styles.aviso}>Carregando cards...</Text>
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
          <FlatList
            data={estado.cards}
            keyExtractor={(card) => String(card.id)}
            renderItem={({ item }) => (
              <CartaoCard
                card={item}
                aoMudarColuna={(id, colunaId) => {
                  mover(id, colunaId).catch((erro: unknown) => console.warn(descreverErro(erro)));
                }}
              />
            )}
            ListHeaderComponent={
              <FormularioCard aoCriar={(titulo, descricao) => incluir(titulo, descricao).then(() => undefined)} />
            }
            ListEmptyComponent={<Text style={styles.vazio}>Nenhum card ainda.</Text>}
            contentContainerStyle={styles.conteudo}
            keyboardShouldPersistTaps="handled"
          />
        );
    }
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar style="light" />
      <View style={styles.cabecalho}>
        <Text style={styles.tituloCabecalho}>Kanban</Text>
      </View>
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
  tituloCabecalho: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: '800',
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
  aviso: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: espacamento.medio,
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
  vazio: {
    color: cores.textoSecundario,
    fontSize: 14,
    textAlign: 'center',
    marginTop: espacamento.grande,
  },
});
