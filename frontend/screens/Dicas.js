import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation, Platform, UIManager, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Habilitar LayoutAnimation para Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Dados de exemplo para dicas com categorias
const categoriasDicas = [
  {
    id: 'cat1',
    nome: 'Antes do desastre',
    dicas: [
      {
        id: '1',
        titulo: 'Prepare um kit de emergência',
        descricao: 'Tenha em mãos água, alimentos não perecíveis, medicamentos, lanterna e rádio a pilha.',
        icone: 'briefcase-outline',
      },
      {
        id: '2',
        titulo: 'Trace rotas de fuga',
        descricao: 'Identifique os caminhos mais seguros para sair de casa ou do trabalho em caso de emergência.',
        icone: 'map',
      },
      {
        id: '3',
        titulo: 'Tenha contatos úteis',
        descricao: 'Mantenha uma lista de telefones de emergência e de familiares próximos.',
        icone: 'call-outline',
      },
    ],
  },
  {
    id: 'cat2',
    nome: 'Durante o desastre',
    dicas: [
      {
        id: '4',
        titulo: 'Mantenha a calma',
        descricao: 'Respire fundo e tente manter a tranquilidade para tomar as melhores decisões.',
        icone: 'leaf-outline',
      },
      {
        id: '5',
        titulo: 'Vá para um local seguro',
        descricao: 'Procure abrigos designados ou áreas elevadas e seguras.',
        icone: 'home-outline',
      },
      {
        id: '6',
        titulo: 'Siga as orientações oficiais',
        descricao: 'Ouça rádio e siga as instruções das autoridades locais e defesa civil.',
        icone: 'megaphone-outline',
      },
    ],
  },
  {
    id: 'cat3',
    nome: 'Após o desastre',
    dicas: [
      {
        id: '7',
        titulo: 'Avalie a situação',
        descricao: 'Verifique se há feridos ou danos estruturais antes de retornar para casa.',
        icone: 'alert-circle-outline',
      },
      {
        id: '8',
        titulo: 'Evite áreas de risco',
        descricao: 'Fique longe de áreas alagadas ou com risco de deslizamento.',
        icone: 'warning-outline',
      },
      {
        id: '9',
        titulo: 'Ajude o próximo',
        descricao: 'Colabore com os esforços de resgate e auxílio aos necessitados, se for seguro.',
        icone: 'heart-outline',
      },
    ],
  },
];

// Componente para um item de dica expansível (Placeholder para Accordion)
const CardDicaExpansivel = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={toggleExpand} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.iconeContainer}>
          <Ionicons name={item.icone} size={24} color="#333333" />
        </View>
        <Text style={styles.tituloDica}>{item.titulo}</Text>
        <Ionicons
          name={expanded ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={20}
          color="#999999"
        />
      </View>
      {expanded && (
        <View style={styles.cardContent}>
          <Text style={styles.descricaoDica}>{item.descricao}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const Dicas = ({ navigation }) => {
  const renderCategoria = ({ item }) => (
    <View key={item.id}>
      <Text style={styles.tituloCategoria}>{item.nome}</Text>
      <FlatList
        data={item.dicas}
        renderItem={({ item: dica }) => <CardDicaExpansivel item={dica} />}
        keyExtractor={(dica) => dica.id}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tituloHeader}>Dicas de Segurança</Text>
        <Text style={styles.subtituloHeader}>
          Aprenda como se manter seguro em diferentes situações
        </Text>
        <TouchableOpacity style={styles.botaoChecklist} onPress={() => Alert.alert('Funcionalidade em desenvolvimento', 'A tela de checklist será implementada futuramente.')}>
           <Ionicons name="list-circle-outline" size={20} color="#3478F6" />
           <Text style={styles.textoBotaoChecklist}>Ver checklist completo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categoriasDicas}
        renderItem={renderCategoria}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
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
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#F5F5F5',
    marginBottom: 16,
  },
  tituloHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtituloHeader: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  botaoChecklist: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotaoChecklist: {
    fontSize: 14,
    color: '#3478F6',
    marginLeft: 4,
    fontWeight: '600',
  },
  lista: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  tituloCategoria: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconeContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tituloDica: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  cardContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  descricaoDica: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});

export default Dicas; 