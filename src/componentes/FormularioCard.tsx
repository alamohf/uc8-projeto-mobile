import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { cores, espacamento } from '../tema';

interface FormularioCardProps {
  aoCriar: (titulo: string, descricao: string) => void;
}

export default function FormularioCard({ aoCriar }: FormularioCardProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const [erro, setErro] = useState('');

  function enviar() {
    const tituloLimpo = titulo.trim();
    const descricaoLimpa = descricao.trim();

    if (tituloLimpo === '' || descricaoLimpa === '') {
      setErro('Preencha título e descrição.');
      return;
    }

    aoCriar(tituloLimpo, descricaoLimpa);
    setTitulo('');
    setDescricao('');
    setErro('');
  }

  return (
    <View style={styles.formulario}>
      <TextInput
        style={styles.campo}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Título"
        placeholderTextColor={cores.textoSecundario}
      />
      <TextInput
        style={styles.campo}
        value={descricao}
        onChangeText={setDescricao}
        placeholder="Descrição"
        placeholderTextColor={cores.textoSecundario}
      />
      {erro !== '' ? <Text style={styles.erro}>{erro}</Text> : null}
      <Pressable style={styles.botao} onPress={enviar}>
        <Text style={styles.textoBotao}>Adicionar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formulario: {
    backgroundColor: cores.superficie,
    borderRadius: 8,
    padding: espacamento.medio,
    marginBottom: espacamento.medio,
  },
  campo: {
    backgroundColor: cores.fundo,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: 6,
    color: cores.texto,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: espacamento.pequeno,
  },
  erro: {
    color: cores.erro,
    fontSize: 13,
    marginBottom: espacamento.pequeno,
  },
  botao: {
    backgroundColor: cores.destaque,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoBotao: {
    color: cores.textoSobreDestaque,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
