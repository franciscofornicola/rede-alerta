import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BotaoPrimario from '../components/BotaoPrimario';
import { SafeAreaView } from 'react-native-safe-area-context';

// Lista de regiões (exemplo)
const regioes = [
  { id: '1', nome: 'Centro' },
  { id: '2', nome: 'Zona Norte' },
  { id: '3', nome: 'Zona Sul' },
  { id: '4', nome: 'Zona Leste' },
  { id: '5', nome: 'Zona Oeste' },
];

const EscolhaRegiao = ({ navigation }) => {
  const [regiaoSelecionada, setRegiaoSelecionada] = useState(null);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemRegiao,
        regiaoSelecionada === item.id && styles.itemSelecionado,
      ]}
      onPress={() => setRegiaoSelecionada(item.id)}
    >
      <Text style={[
        styles.textoRegiao,
        regiaoSelecionada === item.id && styles.textoSelecionado,
      ]}>
        {item.nome}
      </Text>
      {regiaoSelecionada === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Escolha sua região</Text>
      <Text style={styles.subtitulo}>
        Selecione a região onde você mora ou frequenta
      </Text>

      <FlatList
        data={regioes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.lista}
        contentContainerStyle={styles.listaContent}
      />

      <View style={styles.botaoContainer}>
        <BotaoPrimario
          titulo="Confirmar"
          onPress={() => navigation.navigate('MainTabs')}
          disabled={!regiaoSelecionada}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  lista: {
    flex: 1,
  },
  listaContent: {
    paddingBottom: 20,
  },
  itemRegiao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginBottom: 10,
  },
  itemSelecionado: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  textoRegiao: {
    fontSize: 18,
    color: '#333333',
  },
  textoSelecionado: {
    color: '#007AFF',
    fontWeight: '600',
  },
  botaoContainer: {
    paddingVertical: 20,
  },
});

export default EscolhaRegiao; 