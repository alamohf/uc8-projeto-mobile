import React, { useState } from 'react';
import { StyleSheet, Text, StatusBar, Switch, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function getDeviceInfo() {
  return {
    os: Platform.OS === "ios" ? "iOS" : "Android",
    version: Platform.Version
  };
}

export default function App() {
  // Estado booleano correto
  const [showInfo, setShowInfo] = useState(false);
  const deviceInfo = getDeviceInfo();

  return (
    <LinearGradient
      colors={['#064e3b', '#0f766e', '#14b8a6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />

      {/* Cartão centralizado translúcido */}
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Exibir dados do aparelho</Text>
          <Switch
            value={showInfo}
            onValueChange={(value) => setShowInfo(value)}
            trackColor={{ false: '#064e3b', true: '#5eead4' }}
            thumbColor={showInfo ? '#0f766e' : '#f4f3f4'}
          />
        </View>

        {/* Renderização condicional usando showInfo */}
        {showInfo ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Informações do Dispositivo</Text>
            <Text style={styles.infoText}>Sistema: {deviceInfo.os}</Text>
            <Text style={styles.infoText}>Versão: {deviceInfo.version}</Text>
          </View>
        ) : (
          <Text style={styles.text}>Ative a chave acima para exibir os dados.</Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '85%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  infoTitle: {
    color: '#5eead4',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginVertical: 2,
  },
});