import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RotasDaPilha = {
  Quadro: undefined;
  NovoCard: undefined;
  DetalheCard: { id: number };
};

export type PropsDaTela<R extends keyof RotasDaPilha> = NativeStackScreenProps<RotasDaPilha, R>;
