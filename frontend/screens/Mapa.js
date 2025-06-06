import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Imagem de fundo para simular o mapa
const mapBackground = require('../assets/map-background.png');

// Obter dimensões da tela
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Mapa = ({ navigation }) => {
  // Dados de exemplo para os marcadores no mapa com posições simuladas
  const marcadores = [
    { 
      id: '1', 
      tipo: 'Severo', 
      latitude: -23.550520, 
      longitude: -46.633308, 
      icone: 'waves', 
      cor: '#E57373', 
      descricao: 'Área com alto risco de inundação', 
      top: screenHeight * 0.3, 
      left: screenWidth * 0.5 
    },
    { 
      id: '2', 
      tipo: 'Moderado', 
      latitude: -22.906847, 
      longitude: -43.172897, 
      icone: 'nature', 
      cor: '#FFB74D', 
      descricao: 'Ponto com árvores caídas', 
      top: screenHeight * 0.25, 
      left: screenWidth * 0.7 
    },
    { 
      id: '3', 
      tipo: 'Seguro', 
      latitude: -15.794228, 
      longitude: -47.882166, 
      icone: 'check-circle', 
      cor: '#81C784', 
      descricao: 'Região monitorada e segura no momento', 
      top: screenHeight * 0.5, 
      left: screenWidth * 0.2 
    },
  ];

  const handleMarkerPress = (marcador) => {
    Alert.alert(
      `Detalhes do Alerta (${marcador.tipo})`,
      `Descrição: ${marcador.descricao}\n\nLocalização simulada: Lat ${marcador.latitude}, Lon ${marcador.longitude}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <Image
          source={mapBackground}
          style={styles.mapBackground}
          resizeMode="cover"
          pointerEvents="none"
        />

        {/* Marcadores */}
        {marcadores.map(marcador => (
          <TouchableOpacity
            key={marcador.id}
            style={[styles.marker, { top: marcador.top, left: marcador.left }]}
            onPress={() => handleMarkerPress(marcador)}
          >
            <View style={[styles.markerIconContainer, { backgroundColor: marcador.cor }]}>
              <MaterialIcons name={marcador.icone} size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        ))}

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.notificationIcon} 
            onPress={() => Alert.alert('Notificações', 'Ir para tela de notificações (placeholder).')}
          >
            <MaterialIcons name="notifications-none" size={28} color="#333333" />
          </TouchableOpacity>
        </View>

        {/* Legenda */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#E57373' }]} />
            <Text style={styles.legendText}>Severo</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFB74D' }]} />
            <Text style={styles.legendText}>Moderado</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#81C784' }]} />
            <Text style={styles.legendText}>Seguro</Text>
          </View>
        </View>

        {/* Botão Relatar */}
        <TouchableOpacity 
          style={styles.relatarButton} 
          onPress={() => navigation.navigate('Relato')}
        >
          <Text style={styles.relatarButtonText}>Relatar Novo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
  },
  notificationIcon: {
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  legendContainer: {
    position: 'absolute',
    top: 80,
    left: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '500',
  },
  marker: {
    position: 'absolute',
    marginLeft: -17,
    marginTop: -17,
    zIndex: 1,
  },
  markerIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  relatarButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#1A1A1A',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1,
  },
  relatarButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Mapa; 