import React, { useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CartaoCard from './src/componentes/CartaoCard';
import FormularioCard from './src/componentes/FormularioCard';
import { Card } from './src/types/entidades';
import { cores, espacamento } from './src/tema';

const cardsIniciais: Card[] = [
  { id: 1, colunaId: 1, titulo: 'Desenhar tela do quadro', descricao: 'Colunas e cards lado a lado', posicao: 1, criadoEm: new Date() },
  { id: 2, colunaId: 2, titulo: 'Tipar entidades', posicao: 1, criadoEm: new Date() },
  { id: 3, colunaId: 3, titulo: 'Escrever README', descricao: 'Recorte, telas e o que fica de fora', posicao: 1, criadoEm: new Date() },
];

export default function App() {
  const [cards, setCards] = useState<Card[]>(cardsIniciais);

  function adicionarCard(titulo: string, descricao: string) {
    const proximoId = Math.max(0, ...cards.map((c) => c.id)) + 1;
    const proximaPosicao = Math.max(0, ...cards.map((c) => c.posicao)) + 1;
    const novo: Card = {
      id: proximoId,
      colunaId: 1,
      titulo,
      descricao,
      posicao: proximaPosicao,
      criadoEm: new Date(),
    };
    setCards([...cards, novo]);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.tela}>
        <StatusBar style="light" />
        <FlatList
          data={cards}
          keyExtractor={(card) => String(card.id)}
          renderItem={({ item }) => <CartaoCard card={item} />}
          ListHeaderComponent={<FormularioCard aoCriar={adicionarCard} />}
          ListEmptyComponent={<Text style={styles.vazio}>Nenhum card ainda.</Text>}
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    padding: espacamento.medio,
  },
  vazio: {
    color: cores.textoSecundario,
    fontSize: 14,
    textAlign: 'center',
    marginTop: espacamento.grande,
  },
});
