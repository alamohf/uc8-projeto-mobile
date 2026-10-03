import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CartaoCard from './src/componentes/CartaoCard';
import FormularioCard from './src/componentes/FormularioCard';
import { buscarCards } from './src/servicos/cardsServico';
import { Card } from './src/types/entidades';
import { COLUNA_FAZER } from './src/colunas';
import { cores, espacamento } from './src/tema';

export default function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarCards().then((dados) => {
      setCards(dados);
      setCarregando(false);
    });
  }, []);

  function adicionarCard(titulo: string, descricao: string) {
    const proximoId = Math.max(0, ...cards.map((c) => c.id)) + 1;
    const proximaPosicao = Math.max(0, ...cards.map((c) => c.posicao)) + 1;
    const novo: Card = {
      id: proximoId,
      colunaId: COLUNA_FAZER,
      titulo,
      descricao,
      posicao: proximaPosicao,
      criadoEm: new Date(),
    };
    setCards([...cards, novo]);
  }

  function mudarColuna(id: number, colunaId: number) {
    setCards((atuais) => atuais.map((c) => (c.id === id ? { ...c, colunaId } : c)));
  }

  return (
    <GestureHandlerRootView style={styles.raiz}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.tela}>
          <StatusBar style="light" />
          <View style={styles.cabecalho}>
            <Text style={styles.tituloCabecalho}>Kanban</Text>
          </View>
          {carregando ? (
            <View style={styles.carregando}>
              <ActivityIndicator size="large" color={cores.destaque} />
              <Text style={styles.avisoCarregando}>Carregando cards...</Text>
            </View>
          ) : (
            <FlatList
              data={cards}
              keyExtractor={(card) => String(card.id)}
              renderItem={({ item }) => <CartaoCard card={item} aoMudarColuna={mudarColuna} />}
              ListHeaderComponent={<FormularioCard aoCriar={adicionarCard} />}
              ListEmptyComponent={<Text style={styles.vazio}>Nenhum card ainda.</Text>}
              contentContainerStyle={styles.conteudo}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
  },
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
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avisoCarregando: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: espacamento.medio,
  },
  vazio: {
    color: cores.textoSecundario,
    fontSize: 14,
    textAlign: 'center',
    marginTop: espacamento.grande,
  },
});
