import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dados de exemplo para o histórico com tipo de evento
const historico = [
  {
    id: '1',
    data: '15/03/2024',
    hora: '14:30',
    localizacao: 'Rua das Flores, Centro',
    descricao: 'Situação suspeita na Rua das Flores',
    status: 'Em análise',
    tipo: 'Suspeita',
    imagem: null,
  },
  {
    id: '2',
    data: '14/03/2024',
    hora: '20:15',
    localizacao: 'Avenida Principal, Zona Norte',
    descricao: 'Iluminação pública com defeito na Avenida Principal',
    status: 'Resolvido',
    tipo: 'Infraestrutura',
    imagem: null,
  },
  {
    id: '3',
    data: '12/03/2024',
    hora: '09:45',
    localizacao: 'Praça Central, Centro',
    descricao: 'Buraco na rua causando risco aos pedestres',
    status: 'Em andamento',
    tipo: 'Infraestrutura',
    imagem: null,
  },
   {
    id: '4',
    data: '11/03/2024',
    hora: '07:00',
    localizacao: 'Rio Lento, Zona Sul',
    descricao: 'Área com acúmulo de água',
    status: 'Em análise',
    tipo: 'Enchente',
    imagem: null,
  },
];

// Função auxiliar para obter ícone baseado no tipo de evento
const getTipoIcon = (tipo) => {
  switch (tipo) {
    case 'Enchente':
      return 'water';
    case 'Deslizamento':
      return 'terrain';
    case 'Infraestrutura':
      return 'construction';
    case 'Suspeita':
      return 'help-outline';
    default:
      return 'info-outline';
  }
};

const ItemHistorico = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.headerCard}>
      <View style={styles.dataContainer}>
        {/* Ícone do tipo de evento */}
        <MaterialIcons name={getTipoIcon(item.tipo)} size={20} color="#333333" style={{ marginRight: 5 }} />
        <Text style={styles.data}>{item.data}</Text>
        <Text style={styles.hora}>{item.hora}</Text>
      </View>
      <View style={[
        styles.statusContainer,
        { backgroundColor: getStatusColor(item.status) }
      ]}>
        <Text style={styles.status}>{item.status}</Text>
      </View>
    </View>

    <Text style={styles.tipoEvento}>{item.tipo}</Text>
     {/* Exibir localização */}
    <Text style={styles.localizacaoTexto}>{item.localizacao}</Text>

    <Text style={styles.descricao}>{item.descricao}</Text>

    {item.imagem && (
      <Image
        source={{ uri: item.imagem }}
        style={styles.imagem}
        resizeMode="cover"
      />
    )}
  </View>
);

const getStatusColor = (status) => {
  switch (status) {
    case 'Resolvido':
      return '#E8F5E9'; // Verde claro
    case 'Em andamento':
      return '#FFF3E0'; // Laranja claro
    case 'Em análise':
      return '#E3F2FD'; // Azul claro
     case 'Enviado': // Novo status
      return '#E0E0E0'; // Cinza claro
    default:
      return '#F5F5F5';
  }
};

const Historico = () => {
  const [filtroData, setFiltroData] = useState('Todos'); // Placeholder para filtro de data
  const [filtroTipo, setFiltroTipo] = useState('Todos'); // Placeholder para filtro de tipo

  // Implementação real dos filtros seria necessária aqui
  const dadosFiltrados = historico; // Por enquanto, exibe todos

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Histórico de Alertas</Text>
        <Text style={styles.subtitulo}>
          Acompanhe o status dos seus relatos
        </Text>
        {/* Placeholders para Filtros */}
        <View style={styles.filtrosContainer}>
          <TouchableOpacity onPress={() => Alert.alert('Funcionalidade em desenvolvimento', 'O filtro de data será implementado futuramente.')}>
            <Text style={styles.textoFiltro}>Data: {filtroData} ▼</Text>
          </TouchableOpacity>
           <TouchableOpacity onPress={() => Alert.alert('Funcionalidade em desenvolvimento', 'O filtro por tipo será implementado futuramente.')}>
            <Text style={styles.textoFiltro}>Tipo: {filtroTipo} ▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={dadosFiltrados}
        renderItem={({ item }) => <ItemHistorico item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false} // Ocultar barra de scroll vertical
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24, // Ajuste no padding geral
    paddingTop: 48, // Ajuste no padding superior
    backgroundColor: '#F5F5F5',
    marginBottom: 16, // Ajuste na margem inferior
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
   filtrosContainer: {
    flexDirection: 'row',
    marginTop: 12, // Ajuste na margem superior
    gap: 16, // Ajuste no espaçamento entre os filtros
  },
  textoFiltro: {
    fontSize: 14,
    color: '#333333', // Ajuste na cor do texto do filtro
    fontWeight: '600',
  },
  lista: {
    paddingHorizontal: 24, // Ajuste no padding lateral
    paddingBottom: 24, // Ajuste no padding inferior
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // Ajuste no raio da borda
    padding: 16, // Ajuste no padding do card
    marginBottom: 12, // Ajuste na margem inferior entre cards
    elevation: 3, // Ajuste na sombra Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // Ajuste na opacidade da sombra iOS
    shadowRadius: 3, // Ajuste no raio da sombra iOS
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4, // Ajuste na margem inferior
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  data: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4, // Ajuste na margem esquerda
    marginRight: 8, // Ajuste na margem direita
  },
  hora: {
    fontSize: 14,
    color: '#666666',
  },
  statusContainer: {
    paddingHorizontal: 8, // Ajuste no padding horizontal
    paddingVertical: 4, // Ajuste no padding vertical
    borderRadius: 12, // Ajuste no raio da borda
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
   tipoEvento: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4, // Ajuste na margem inferior
  },
   localizacaoTexto: { // Estilo para a localização
    fontSize: 14,
    color: '#666666',
    marginBottom: 8, // Espaço entre localização e descrição
  },
  descricao: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 22,
  },
  imagem: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default Historico; 