import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RotasDaPilha = {
  Quadro: undefined;
  NovoCard: undefined;
};

export type PropsDaTela<R extends keyof RotasDaPilha> = NativeStackScreenProps<RotasDaPilha, R>;
