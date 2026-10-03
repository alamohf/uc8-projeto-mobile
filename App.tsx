import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import CartaoCard from './src/componentes/CartaoCard';
import { Card } from './src/types/entidades';
import { cores, espacamento } from './src/tema';

const cardsIniciais: Card[] = [
  { id: 1, colunaId: 1, titulo: 'Desenhar tela do quadro', descricao: 'Colunas e cards lado a lado', posicao: 1, criadoEm: new Date() },
  { id: 2, colunaId: 2, titulo: 'Tipar entidades', posicao: 1, criadoEm: new Date() },
  { id: 3, colunaId: 3, titulo: 'Escrever README', descricao: 'Recorte, telas e o que fica de fora', posicao: 1, criadoEm: new Date() },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.tela}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.conteudo}>
          {cardsIniciais.map((card) => (
            <CartaoCard key={card.id} card={card} />
          ))}
        </ScrollView>
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
});
