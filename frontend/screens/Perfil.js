import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Dados de exemplo para o perfil
const usuario = {
  nome: 'João Silva',
  tipoUsuario: 'Cidadão Ativo',
  avatar: null, // URL da imagem do avatar (placeholder)
  nivel: 'Nível 5',
  pontos: 750,
  pontosProximoNivel: 1000,
  selos: [
    {
      id: '1',
      nome: 'Primeiro Relato',
      descricao: 'Enviou seu primeiro relato',
      icone: 'star',
      cor: '#FFD700',
    },
    {
      id: '2',
      nome: 'Contribuidor Fiel',
      descricao: 'Enviou 10 relatos',
      icone: 'military-tech',
      cor: '#4CAF50',
    },
    {
      id: '3',
      nome: 'Vigilante Noturno',
      descricao: 'Enviou 5 relatos durante a noite',
      icone: 'nightlight-round',
      cor: '#9C27B0',
    },
    {
      id: '4',
      nome: 'Ajudante Local',
      descricao: 'Relato validado pelas autoridades',
      icone: 'check-circle',
      cor: '#2196F3',
    },
  ],
};

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
  // Calcular progresso para a barra (exemplo simples)
  const progresso = (usuario.pontos / usuario.pontosProximoNivel) * 100;
  const pontosFaltando = usuario.pontosProximoNivel - usuario.pontos;

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
             {/* Botão placeholder para editar avatar */}
             <TouchableOpacity style={styles.botaoEditarAvatar} onPress={() => Alert.alert('Funcionalidade em desenvolvimento', 'Edição de avatar será implementada.')}>
                <MaterialIcons name="camera-alt" size={24} color="#FFFFFF" />
             </TouchableOpacity>
          </View>
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Text style={styles.tipoUsuario}>{usuario.tipoUsuario}</Text>

          <View style={styles.pontosContainer}>
            <MaterialIcons name="stars" size={24} color="#FFD700" />
            <Text style={styles.pontos}>{usuario.pontos} pontos</Text>
          </View>

          {/* Placeholder para Barra de Progresso */}
          <View style={styles.barraProgressoContainer}>
             <Text style={styles.textoProgresso}>Faltam {pontosFaltando} pontos para o próximo selo!</Text>
             <View style={styles.barraVazia}>
                <View style={[styles.barraPreenchida, { width: `${progresso > 100 ? 100 : progresso}%` }]} />
             </View>
          </View>

          {/* Botões de Ação */}
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
          {usuario.selos.map((selo) => (
            <Selo key={selo.id} selo={selo} />
          ))}
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
  header: {
    backgroundColor: '#F5F5F5',
    padding: 24, // Ajuste no padding geral
    paddingTop: 48, // Ajuste no padding superior
    alignItems: 'center',
    marginBottom: 24, // Ajuste na margem inferior
  },
  avatarContainer: {
    marginBottom: 16, // Ajuste na margem inferior
    position: 'relative', // Para posicionar o botão de editar avatar
  },
  avatar: {
    width: 100, // Ajuste no tamanho do avatar
    height: 100, // Ajuste no tamanho do avatar
    borderRadius: 50, // Raio para ser circular
  },
  avatarPlaceholder: {
    width: 100, // Ajuste no tamanho do placeholder
    height: 100, // Ajuste no tamanho do placeholder
    borderRadius: 50, // Raio para ser circular
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
   botaoEditarAvatar: { // Estilo para o botão de editar avatar
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3478F6', // Cor primária azul
    borderRadius: 18, // Raio para ser circular
    padding: 6, // Padding interno
    elevation: 3, // Sombra Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  nome: {
    fontSize: 22, // Ajuste no tamanho da fonte
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4, // Ajuste na margem inferior
  },
  tipoUsuario: {
    fontSize: 15, // Ajuste no tamanho da fonte
    color: '#666666',
    marginBottom: 16, // Ajuste na margem inferior
  },
  nivel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 15,
  },
  pontosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16, // Ajuste no padding horizontal
    paddingVertical: 8, // Ajuste no padding vertical
    borderRadius: 20, // Mantido o raio
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    marginBottom: 24, // Ajuste na margem inferior
  },
  pontos: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8, // Ajuste na margem esquerda
  },
   barraProgressoContainer: {
    width: '100%',
    marginTop: 8, // Ajuste na margem superior
    alignItems: 'center',
    marginBottom: 24, // Ajuste na margem inferior
  },
  textoProgresso: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4, // Ajuste na margem inferior
  },
  barraVazia: {
    width: '90%', // Ajuste na largura
    height: 8, // Ajuste na altura
    backgroundColor: '#E0E0E0',
    borderRadius: 4, // Ajuste no raio da borda
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: '100%',
    backgroundColor: '#3478F6', // Cor primária azul
    borderRadius: 4, // Ajuste no raio da borda
  },
  botoesAcao: {
    flexDirection: 'row',
    marginTop: 16, // Ajuste na margem superior
    gap: 24, // Ajuste no espaçamento entre os botões
  },
  botaoAcao: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoBotaoAcao: {
    fontSize: 15, // Ajuste no tamanho da fonte
    color: '#333333', // Ajuste na cor do texto
    marginLeft: 4, // Ajuste na margem esquerda
    fontWeight: '600',
  },
  selosContainer: {
    paddingHorizontal: 24, // Ajuste no padding lateral
    paddingBottom: 24, // Ajuste no padding inferior
  },
  selosTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16, // Ajuste na margem inferior
  },
  seloCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16, // Ajuste no padding do card
    borderRadius: 12, // Ajuste no raio da borda
    marginBottom: 12, // Ajuste na margem inferior entre cards
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, // Ajuste na sombra iOS
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconeContainerSelo: {
    width: 40, // Ajuste no tamanho
    height: 40, // Ajuste no tamanho
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16, // Ajuste na margem direita
  },
  seloInfo: {
    flex: 1,
  },
  seloNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4, // Ajuste na margem inferior
  },
  seloDescricao: {
    fontSize: 13, // Ajuste no tamanho da fonte
    color: '#666666',
  },
});

export default Perfil; 