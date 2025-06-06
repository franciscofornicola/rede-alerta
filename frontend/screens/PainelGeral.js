import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MenuItemCard from '../components/MenuItemCard'; // Importar o novo componente

const PainelGeral = ({ navigation }) => {
  const [alertas, setAlertas] = useState([]); // Estado para armazenar os alertas

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        // Substitua 'seu_endereco_do_backend' pelo endereço onde seu FastAPI está rodando
        // Usando a URL do backend deployado no Render
        const response = await fetch('https://rede-alerta-backend.onrender.com/alertas/');
        const data = await response.json();
        setAlertas(data); // Armazena os alertas no estado
      } catch (error) {
        console.error('Erro ao buscar alertas:', error);
      }
    };

    fetchAlertas(); // Chama a função para buscar os alertas

    // A lista de dependências vazia [] garante que este efeito rode apenas uma vez (ao montar o componente)
  }, []);

  // A função renderMenuItem foi substituída pelo componente MenuItemCard

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, Usuário!</Text>
          <Text style={styles.headerTitle}>Painel Geral</Text>
          <Text style={styles.headerSubtitle}>
            Aqui você encontra as ferramentas para ajudar a sua comunidade.
          </Text>
        </View>

        {/* Menu Items Section */}
        <View style={styles.menuContainer}>
          <MenuItemCard
            title='Relatar Ocorrência'
            subtitle='Compartilhe informações urgentes e locais'
            iconName='report-problem'
            bgColor='#E57373' // Exemplo de cor para Relatar (vermelho)
            iconBgColor='#C62828' // Cor de fundo do ícone
            onPress={() => navigation.navigate('Relato')}
          />
          <MenuItemCard
            title='Dicas de Segurança'
            subtitle='Orientações para agir em diferentes situações'
            iconName='lightbulb-outline'
            bgColor='#FFB74D' // Exemplo de cor para Dicas (laranja)
            iconBgColor='#EF6C00' // Cor de fundo do ícone
            onPress={() => navigation.navigate('Dicas')}
          />
          <MenuItemCard
            title='Meu Histórico'
            subtitle='Veja seus relatos e contribuições passadas'
            iconName='history'
            bgColor='#64B5F6' // Exemplo de cor para Histórico (azul claro)
            iconBgColor='#1565C0' // Cor de fundo do ícone
            onPress={() => navigation.navigate('Historico')}
          />
          {/* Adicionar mais itens de menu conforme o protótipo, se houver */}
          {/* Exemplo: <MenuItemCard
            title='Mapa de Alertas'
            subtitle='Visualize ocorrências na sua região'
            iconName='map'
            bgColor='#81C784' // Exemplo de cor (verde)
            iconBgColor='#388E3C' // Cor de fundo do ícone
            onPress={() => navigation.navigate('Mapa')}
          />*/}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4', // Cor de fundo geral
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
  menuContainer: {
    // Sem flex: 1 para permitir o scroll do ScrollView
    gap: 15, // Espaçamento entre os itens do menu
  },
  // Os estilos para menuItem, menuIconContainer, menuTextContainer, etc. foram movidos para MenuItemCard.js
});

export default PainelGeral; 