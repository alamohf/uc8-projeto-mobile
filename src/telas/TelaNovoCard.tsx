import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import FormularioCard from '../componentes/FormularioCard';
import { useQuadro } from '../contexto/QuadroContexto';
import type { PropsDaTela } from '../navegacao/rotas';
import { espacamento } from '../tema';

export default function TelaNovoCard({ navigation }: PropsDaTela<'NovoCard'>) {
  const { incluir } = useQuadro();

  return (
    <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <FormularioCard aoCriar={(titulo, descricao) => incluir(titulo, descricao).then(() => navigation.goBack())} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: espacamento.medio,
  },
});
