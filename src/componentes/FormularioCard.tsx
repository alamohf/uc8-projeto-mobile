import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { registrarErro } from '../erros/erros';
import { cores, espacamento, raios } from '../tema';
import { TAMANHO_MAXIMO_TITULO, mensagemDoCard } from '../validacao';

interface FormularioCardProps {
  aoCriar: (titulo: string, descricao: string) => Promise<void>;
}

export default function FormularioCard({ aoCriar }: FormularioCardProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const [erro, setErro] = useState('');
  const [focado, setFocado] = useState<'titulo' | 'descricao' | null>(null);

  function enviar() {
    const tituloLimpo = titulo.trim();
    const descricaoLimpa = descricao.trim();

    const recusa = mensagemDoCard(tituloLimpo, descricaoLimpa);
    if (recusa !== undefined) {
      setErro(recusa);
      return;
    }

    aoCriar(tituloLimpo, descricaoLimpa)
      .then(() => {
        setTitulo('');
        setDescricao('');
        setErro('');
      })
      .catch((falha: unknown) => {
        setErro(registrarErro('cadastro', falha).mensagem);
      });
  }

  return (
    <View style={styles.formulario}>
      <TextInput
        style={[styles.campo, focado === 'titulo' && styles.campoFocado]}
        value={titulo}
        onChangeText={setTitulo}
        onFocus={() => setFocado('titulo')}
        onBlur={() => setFocado(null)}
        maxLength={TAMANHO_MAXIMO_TITULO}
        placeholder="Título"
        placeholderTextColor={cores.textoSecundario}
      />
      <TextInput
        style={[styles.campo, focado === 'descricao' && styles.campoFocado]}
        value={descricao}
        onChangeText={setDescricao}
        onFocus={() => setFocado('descricao')}
        onBlur={() => setFocado(null)}
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
    backgroundColor: cores.cartao,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: raios.cartao,
    padding: espacamento.medio,
    marginBottom: espacamento.medio,
  },
  campo: {
    backgroundColor: cores.fundo,
    borderColor: cores.bordaForte,
    borderWidth: 1,
    borderRadius: raios.campo,
    color: cores.texto,
    fontSize: 14,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: espacamento.pequeno,
  },
  campoFocado: {
    borderColor: cores.primaria,
  },
  erro: {
    color: cores.erro,
    fontSize: 13,
    marginBottom: espacamento.pequeno,
  },
  botao: {
    backgroundColor: cores.primaria,
    borderRadius: raios.campo,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    color: cores.textoSobrePrimaria,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
