import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Componente de botão primário reutilizável
const BotaoPrimario = ({ onPress, titulo, style, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.botao, style, disabled && styles.botaoDesabilitado]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.texto, disabled && styles.textoDesabilitado]}>{titulo}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botao: {
    backgroundColor: '#3478F6',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3478F6',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  botaoDesabilitado: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  textoDesabilitado: {
    color: '#9E9E9E',
  },
});

export default BotaoPrimario; 