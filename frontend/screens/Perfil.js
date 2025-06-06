import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Selo = ({ selo }) => (
  <View style={styles.seloCard}>
    <View style={[styles.iconeContainerSelo, { backgroundColor: selo.cor + '20' }]}>
      <MaterialIcons name={selo.icone} size={30} color={selo.cor} />
    </View>
    <View style={styles.seloInfo}>
      <Text style={styles.seloNome}>{selo.nome}</Text>
      <Text style={styles.seloDescricao}>{selo.descricao}</Text>
    </View>
  </View>
);

const Perfil = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPerfil();
  }, []);

  const fetchPerfil = async () => {
    try {
      setLoading(true);
      // TODO: Substituir 1 pelo ID do usuário logado
      const response = await fetch('http://192.168.0.236:8000/usuarios/1/perfil');
      if (!response.ok) {
        throw new Error('Erro ao carregar perfil');
      }
      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3478F6" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color="#E57373" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPerfil}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!usuario) {
    return null;
  }

  // Calcular progresso para a barra
  const pontosProximoNivel = usuario.nivel * 100;
  const progresso = (usuario.pontos / pontosProximoNivel) * 100;
  const pontosFaltando = pontosProximoNivel - usuario.pontos;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {usuario.avatar ? (
              <Image
                source={{ uri: usuario.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={50} color="#999999" />
              </View>
            )}
            <TouchableOpacity style={styles.botaoEditarAvatar} onPress={() => Alert.alert('Funcionalidade em desenvolvimento', 'Edição de avatar será implementada.')}>
              <MaterialIcons name="camera-alt" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Text style={styles.tipoUsuario}>Nível {usuario.nivel}</Text>

          <View style={styles.pontosContainer}>
            <MaterialIcons name="stars" size={24} color="#FFD700" />
            <Text style={styles.pontos}>{usuario.pontos} pontos</Text>
          </View>

          <View style={styles.barraProgressoContainer}>
            <Text style={styles.textoProgresso}>Faltam {pontosFaltando} pontos para o próximo nível!</Text>
            <View style={styles.barraVazia}>
              <View style={[styles.barraPreenchida, { width: `${progresso > 100 ? 100 : progresso}%` }]} />
            </View>
          </View>

          <View style={styles.botoesAcao}>
            <TouchableOpacity style={styles.botaoAcao} onPress={() => Alert.alert('Funcionalidade em desenvolvimento', 'A tela de edição de perfil será implementada futuramente.')}>
              <MaterialIcons name="edit" size={20} color="#333333" />
              <Text style={styles.textoBotaoAcao}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoAcao} onPress={() => Alert.alert('Funcionalidade em desenvolvimento', 'A tela de ranking local será implementada futuramente.')}>
              <MaterialIcons name="leaderboard" size={20} color="#333333" />
              <Text style={styles.textoBotaoAcao}>Ranking Local</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.selosContainer}>
          <Text style={styles.selosTitulo}>Selos Conquistados</Text>
          {usuario.conquistas && usuario.conquistas.length > 0 ? (
            usuario.conquistas.map((selo) => (
              <Selo key={selo.id} selo={selo} />
            ))
          ) : (
            <Text style={styles.semSelosText}>Nenhum selo conquistado ainda.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#E57373',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3478F6',
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#F5F5F5',
    padding: 24,
    paddingTop: 48,
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoEditarAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3478F6',
    borderRadius: 18,
    padding: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  tipoUsuario: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 16,
  },
  pontosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    marginBottom: 24,
  },
  pontos: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  barraProgressoContainer: {
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  textoProgresso: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  barraVazia: {
    width: '90%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: '100%',
    backgroundColor: '#3478F6',
    borderRadius: 4,
  },
  botoesAcao: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 24,
  },
  botaoAcao: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoBotaoAcao: {
    fontSize: 15,
    color: '#333333',
    marginLeft: 4,
    fontWeight: '600',
  },
  selosContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  selosTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  semSelosText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  seloCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconeContainerSelo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  seloInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  seloNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  seloDescricao: {
    fontSize: 14,
    color: '#666666',
  },
});

export default Perfil; 