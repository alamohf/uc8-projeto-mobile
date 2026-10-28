import React from 'react';
import { StyleSheet } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QuadroProvedor } from './src/contexto/QuadroContexto';
import type { RotasDaPilha } from './src/navegacao/rotas';
import TelaBusca from './src/telas/TelaBusca';
import TelaDetalheCard from './src/telas/TelaDetalheCard';
import TelaNovoCard from './src/telas/TelaNovoCard';
import TelaQuadro from './src/telas/TelaQuadro';
import { cores } from './src/tema';

const Pilha = createNativeStackNavigator<RotasDaPilha>();

const temaDoApp = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: cores.fundo,
    card: cores.verde,
    text: cores.texto,
    primary: cores.destaque,
    border: cores.borda,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.raiz}>
      <SafeAreaProvider>
        <QuadroProvedor>
          <NavigationContainer theme={temaDoApp}>
            <Pilha.Navigator initialRouteName="Quadro">
              <Pilha.Screen name="Quadro" component={TelaQuadro} options={{ headerShown: false }} />
              <Pilha.Screen name="NovoCard" component={TelaNovoCard} options={{ title: 'Novo card' }} />
              <Pilha.Screen name="DetalheCard" component={TelaDetalheCard} options={{ title: 'Card' }} />
              <Pilha.Screen name="Busca" component={TelaBusca} options={{ title: 'Buscar' }} />
            </Pilha.Navigator>
          </NavigationContainer>
        </QuadroProvedor>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
  },
});
