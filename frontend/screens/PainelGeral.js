import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MenuItemCard from '../components/MenuItemCard';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const PainelGeral = ({ navigation }) => {
  const [alertas, setAlertas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchAlertas = async () => {
        console.log('Buscando alertas...');
        try {
          const response = await fetch('http://192.168.0.236:8000/alertas/');
          const data = await response.json();
          console.log('Alertas recebidos:', data);
          setAlertas(data);
        } catch (error) {
          console.error('Erro ao buscar alertas:', error);
        }
      };

      fetchAlertas();

      return () => {
        console.log('Saindo da tela PainelGeral');
      };
    }, [])
  );

  const handleDeleteAlerta = async (id) => {
    console.log(`Deletando alerta com ID: ${id}`);
    try {
      const response = await fetch(`http://192.168.0.236:8000/alertas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Erro ao deletar alerta no backend');
      }

      setAlertas(alertas.filter(alerta => alerta.id !== id));
      console.log(`Alerta com ID ${id} deletado com sucesso.`);

    } catch (error) {
      console.error('Erro ao deletar alerta:', error);
      Alert.alert('Erro', `Falha ao deletar relato: ${error.message}`);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    console.log(`Atualizando status do alerta com ID: ${id} para: ${status}`);
    try {
      const response = await fetch(`http://192.168.0.236:8000/alertas/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: status }),
      });

      console.log('Resposta do servidor:', response.status);
      const responseText = await response.text();
      console.log('Texto da resposta:', responseText);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${responseText}`);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Erro ao fazer parse da resposta:', e);
        throw new Error('Erro ao processar resposta do servidor');
      }

      setAlertas(alertas.map(alerta =>
        alerta.id === id ? { ...alerta, status } : alerta
      ));
      console.log(`Status do alerta com ID ${id} atualizado com sucesso.`);

    } catch (error) {
      console.error('Erro ao atualizar status do alerta:', error);
      Alert.alert('Erro', `Falha ao atualizar status do relato: ${error.message}`);
    }
  };

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
            bgColor='#E57373'
            iconBgColor='#C62828'
            onPress={() => navigation.navigate('Relato')}
          />
          <MenuItemCard
            title='Dicas de Segurança'
            subtitle='Orientações para agir em diferentes situações'
            iconName='lightbulb-outline'
            bgColor='#FFB74D'
            iconBgColor='#EF6C00'
            onPress={() => navigation.navigate('Dicas')}
          />
          <MenuItemCard
            title='Meu Histórico'
            subtitle='Veja seus relatos e contribuições passadas'
            iconName='history'
            bgColor='#64B5F6'
            iconBgColor='#1565C0'
            onPress={() => navigation.navigate('Historico')}
          />
          {/* Adicionar mais itens de menu conforme o protótipo, se houver */}
          {/* <MenuItemCard
            title='Mapa de Alertas'
            subtitle='Visualize ocorrências na sua região'
            iconName='map'
            bgColor='#81C784'
            iconBgColor='#388E3C'
            onPress={() => navigation.navigate('Mapa')}
          />*/}
        </View>

        {/* Latest Alerts Section */}
        <View style={styles.alertsContainer}>
          <Text style={styles.alertsTitle}>Últimos Alertas</Text>
          {alertas.length === 0 ? (
            <Text style={styles.noAlertsText}>Nenhum alerta encontrado.</Text>
          ) : (
            alertas.map((alerta) => (
              <View key={alerta.id} style={styles.alertItem}>
                <View style={styles.alertContent}>
                  <Text style={styles.alertDescription}>{alerta.descricao}</Text>
                  <Text style={styles.alertMeta}>
                    Tipo: {alerta.tipo} | Status: {alerta.status} | Data: {alerta.data_ocorrencia}
                  </Text>
                </View>
                {alerta.status !== 'Resolvido' && (
                  <TouchableOpacity onPress={() => handleUpdateStatus(alerta.id, 'Resolvido')} style={styles.updateStatusButton}>
                    <Text style={styles.updateStatusButtonText}>Marcar como Resolvido</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => handleDeleteAlerta(alerta.id)} style={styles.deleteButton}>
                  <MaterialIcons name="delete" size={24} color="#E57373" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
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
    gap: 15,
  },
  alertsContainer: {
    marginTop: 20,
  },
  alertsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  noAlertsText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  alertItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertContent: {
    flex: 1,
    marginRight: 10,
  },
  alertDescription: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 5,
  },
  alertMeta: {
    fontSize: 14,
    color: '#666666',
  },
  updateStatusButton: {
    backgroundColor: '#FFB74D',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  updateStatusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  deleteButton: {
    marginLeft: 5,
  },
});

export default PainelGeral; 