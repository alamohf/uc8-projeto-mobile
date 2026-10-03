import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../types/entidades';
import { cores, espacamento } from '../tema';

interface CartaoCardProps {
  card: Card;
}

const COLUNA_FEITO = 3;

export default function CartaoCard({ card }: CartaoCardProps) {
  const concluido = card.colunaId === COLUNA_FEITO;

  return (
    <View style={[styles.cartao, concluido && styles.cartaoConcluido]}>
      <Text style={[styles.titulo, concluido && styles.tituloConcluido]}>{card.titulo}</Text>
      {card.descricao ? <Text style={styles.descricao}>{card.descricao}</Text> : null}
      <Text style={styles.data}>Criado em {card.criadoEm.toLocaleDateString('pt-BR')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    backgroundColor: cores.superficie,
    borderLeftWidth: 4,
    borderLeftColor: cores.verde,
    borderRadius: 8,
    padding: espacamento.medio,
    marginBottom: espacamento.pequeno,
  },
  cartaoConcluido: {
    borderLeftColor: cores.destaque,
    opacity: 0.7,
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
  data: {
    color: cores.destaque,
    fontSize: 12,
    marginTop: espacamento.pequeno,
  },
});
