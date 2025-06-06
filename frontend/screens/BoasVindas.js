import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotaoPrimario from '../components/BotaoPrimario';

const BoasVindas = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Rede Alerta</Text>
          <Text style={styles.subtitulo}>
            Sua rede comunitária de prevenção de desastres
          </Text>
        </View>
        
        <View style={styles.imagemContainer}>
          <Image
            source={require('../assets/welcome-image.png')}
            style={styles.imagem}
            resizeMode="contain"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.descricao}>
            Junte-se a cidadãos ativos que ajudam a manter suas comunidades seguras com relatos e dicas em tempo real.
          </Text>

          <BotaoPrimario
            titulo="Começar"
            onPress={() => navigation.navigate('EscolhaRegiao')}
            style={styles.botao}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titulo: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
    fontWeight: '500',
  },
  imagemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 32,
  },
  imagem: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  footer: {
    alignItems: 'center',
  },
  descricao: {
    fontSize: 16,
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 16,
    fontWeight: '400',
  },
  botao: {
    width: '100%',
    height: 56,
    backgroundColor: '#3478F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3478F6',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default BoasVindas; 