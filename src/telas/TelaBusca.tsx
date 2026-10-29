import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { filtrarCards } from '../busca';
import { COLUNA_FEITO, nomesColunas } from '../colunas';
import { useQuadro } from '../contexto/QuadroContexto';
import type { PropsDaTela } from '../navegacao/rotas';
import { cores, espacamento, estiloDaColuna, estiloSemColuna, raios } from '../tema';

export default function TelaBusca({ navigation }: PropsDaTela<'Busca'>) {
  const { estado } = useQuadro();
  const [consulta, setConsulta] = useState('');

  const cards = estado.tipo === 'pronto' ? estado.cards : [];
  const resultados = filtrarCards(cards, consulta);

  function mensagemVazia(): string {
    return consulta.trim() === '' ? 'Digite para buscar por título ou descrição.' : 'Nenhum card encontrado.';
  }

  return (
    <View style={styles.tela}>
      <TextInput
        style={styles.campo}
        value={consulta}
        onChangeText={setConsulta}
        placeholder="Buscar por título ou descrição"
        placeholderTextColor={cores.textoSecundario}
        autoFocus
        autoCorrect={false}
      />
      {consulta.trim() !== '' && resultados.length > 0 ? (
        <Text style={styles.contagem}>
          {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
        </Text>
      ) : null}
      <FlatList
        data={resultados}
        keyExtractor={(card) => String(card.id)}
        renderItem={({ item }) => (
          <Pressable style={styles.resultado} onPress={() => navigation.navigate('DetalheCard', { id: item.id })}>
            <Text style={[styles.titulo, item.colunaId === COLUNA_FEITO && styles.tituloConcluido]}>{item.titulo}</Text>
            {item.descricao ? <Text style={styles.descricao}>{item.descricao}</Text> : null}
            <Text style={[styles.coluna, { color: (estiloDaColuna[item.colunaId] ?? estiloSemColuna).cor }]}>
              {nomesColunas[item.colunaId] ?? 'Sem coluna'}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>{mensagemVazia()}</Text>}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    padding: espacamento.medio,
  },
  campo: {
    backgroundColor: cores.superficie,
    borderColor: cores.bordaForte,
    borderWidth: 1,
    borderRadius: raios.campo,
    color: cores.texto,
    fontSize: 14,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: espacamento.pequeno,
  },
  contagem: {
    color: cores.textoSecundario,
    fontSize: 13,
    marginBottom: espacamento.pequeno,
  },
  resultado: {
    backgroundColor: cores.cartao,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raios.cartao,
    padding: espacamento.md,
    marginBottom: espacamento.pequeno,
  },
  titulo: {
    color: cores.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  tituloConcluido: {
    textDecorationLine: 'line-through',
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: 4,
  },
  coluna: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: espacamento.pequeno,
  },
  vazio: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: espacamento.medio,
  },
});
