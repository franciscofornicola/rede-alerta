import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import BotaoPrimario from '../components/BotaoPrimario';
import { SafeAreaView } from 'react-native-safe-area-context';

const Relato = ({ navigation }) => {
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const usarGPS = async () => {
    Alert.alert('Funcionalidade em desenvolvimento', 'O botão de usar GPS será implementado futuramente.');
  };

  const iniciarGravacao = async () => {
    Alert.alert('Funcionalidade em desenvolvimento', 'A gravação de áudio será implementada futuramente.');
  };

  const pararGravacao = async () => {
    // Implementação real precisaria de: recording.stopAndUnloadAsync() e getURI()
  };

  const enviarRelato = async () => {
    if (!descricao.trim() || !localizacao.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha a descrição e a localização do ocorrido.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('https://rede-alerta-backend.onrender.com/alertas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'Relato', // Placeholder - Idealmente viria da UI (ex: um dropdown)
          descricao: descricao.trim(),
          latitude: 0.0, // Placeholder - Idealmente viria de um seletor de mapa ou GPS
          longitude: 0.0, // Placeholder - Idealmente viria de um seletor de mapa ou GPS
          // Podemos adicionar a localização textual na descrição ou em outro campo se o backend suportar
          // Por enquanto, usamos latitude/longitude como placeholders para a API
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Se a resposta não for bem-sucedida (ex: status 400, 500)
        console.error('Erro na resposta da API:', responseData);
        throw new Error(responseData.detail || 'Erro ao enviar relato');
      }

      Alert.alert(
        'Sucesso',
        'Seu relato foi enviado com sucesso!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      console.error('Erro ao enviar relato:', error);
      Alert.alert('Erro', `Falha ao enviar relato: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>Novo Relato</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Descrição do ocorrido</Text>
          <View style={styles.descricaoContainer}>
            <TextInput
              style={[styles.input, styles.descricaoInput]}
              multiline
              numberOfLines={4}
              placeholder="Descreva o que aconteceu..."
              placeholderTextColor="#999999"
              value={descricao}
              onChangeText={setDescricao}
            />
            <TouchableOpacity
              style={styles.botaoAudio}
              onPress={iniciarGravacao}
            >
              <MaterialIcons name="mic-none" size={24} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Localização</Text>
          <View style={styles.localizacaoContainer}>
            <TextInput
              style={[styles.input, styles.localizacaoInput]}
              placeholder="Onde isso aconteceu?"
              placeholderTextColor="#999999"
              value={localizacao}
              onChangeText={setLocalizacao}
            />
            <TouchableOpacity
              style={styles.botaoGPS}
              onPress={usarGPS}
              disabled={isSubmitting}
            >
              <MaterialIcons name="gps-fixed" size={24} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Adicionar foto (Opcional)</Text>
          <TouchableOpacity
            style={styles.botaoImagem}
            onPress={selecionarImagem}
          >
            {imagem ? (
              <Image source={{ uri: imagem }} style={styles.imagem} />
            ) : (
              <View style={styles.placeholderImagem}>
                <Ionicons name="camera" size={30} color="#999999" />
                <Text style={styles.textoPlaceholder}>Toque para adicionar uma foto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <BotaoPrimario
          titulo={isSubmitting ? 'Enviando...' : 'Enviar Relato'}
          onPress={enviarRelato}
          style={styles.botaoEnviar}
          disabled={isSubmitting}
        >
          {isSubmitting && <ActivityIndicator size="small" color="#FFFFFF" style={styles.loadingIndicator} />}
        </BotaoPrimario>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  descricaoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  descricaoInput: {
    flex: 1,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333333',
    backgroundColor: 'transparent',
    padding: 0,
    marginRight: 8,
  },
  botaoAudio: {
    padding: 8,
  },
  localizacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    backgroundColor: 'transparent',
    padding: 0,
  },
  localizacaoInput: {
    marginRight: 8,
  },
  botaoGPS: {
    padding: 8,
  },
  botaoImagem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  placeholderImagem: {
    alignItems: 'center',
  },
  textoPlaceholder: {
    fontSize: 16,
    color: '#999999',
    marginTop: 8,
  },
  imagem: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  botaoEnviar: {
    marginTop: 20,
  },
  loadingIndicator: {
    marginLeft: 10,
  },
});

export default Relato; 