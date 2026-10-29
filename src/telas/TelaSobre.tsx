import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { rotuloGuardados } from '../contagem';
import { useQuadro } from '../contexto/QuadroContexto';
import { cores, espacamento } from '../tema';

const versao: string = Constants.expoConfig?.version ?? 'desconhecida';

export default function TelaSobre() {
  const { guardados } = useQuadro();

  return (
    <ScrollView contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Kanban</Text>
      <Text style={styles.subtitulo}>Aplicativo mobile da UC8, por Álamo Henrique.</Text>
      <View style={styles.linha}>
        <Text style={styles.rotulo}>Versão</Text>
        <Text style={styles.valor}>{versao}</Text>
      </View>
      <View style={styles.linha}>
        <Text style={styles.rotulo}>Guardados no aparelho</Text>
        <Text style={styles.valor}>{rotuloGuardados(guardados)}</Text>
      </View>
      <View style={styles.linha}>
        <Text style={styles.rotulo}>Sistema de origem</Text>
        <Text style={styles.valor}>Kanban Desktop (UC5)</Text>
      </View>
      <Text style={styles.secao}>Seus dados</Text>
      <Text style={styles.texto}>
        O aplicativo não pede nem guarda dado pessoal: só os títulos e as descrições dos cards, na nuvem e numa cópia no
        armazenamento interno do aparelho, que outros aplicativos não acessam.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    padding: espacamento.medio,
  },
  titulo: {
    color: cores.texto,
    fontSize: 24,
    fontWeight: '800',
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: 14,
    marginTop: 4,
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
  valor: {
    color: cores.texto,
    fontSize: 14,
    fontWeight: '700',
  },
  secao: {
    color: cores.primaria,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginTop: espacamento.grande,
    marginBottom: espacamento.pequeno,
  },
  texto: {
    color: cores.textoSecundario,
    fontSize: 14,
    lineHeight: 20,
  },
});
