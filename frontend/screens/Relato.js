import React, { useState, useEffect, useRef } from 'react';
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
import * as Camera from 'expo-camera';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const Relato = ({ navigation }) => {
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foto, setFoto] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [temPermissaoCamera, setTemPermissaoCamera] = useState(null);
  const [temPermissaoLocalizacao, setTemPermissaoLocalizacao] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status: statusCamera } = await Camera.requestCameraPermissionsAsync();
      setTemPermissaoCamera(statusCamera === 'granted');
      const { status: statusLocation } = await Location.requestForegroundPermissionsAsync();
      setTemPermissaoLocalizacao(statusLocation === 'granted');
    })();
  }, []);

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

  const tirarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à câmera para tirar uma foto.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
      setImagem(result.assets[0].uri);
    }
  };

  const usarGPS = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à localização para usar o GPS.');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setLocalizacao(`Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`);
  };

  const iniciarGravacao = async () => {
    Alert.alert('Funcionalidade em desenvolvimento', 'A gravação de áudio será implementada futuramente.');
  };

  const pararGravacao = async () => {
    // Implementação real precisaria de: recording.stopAndUnloadAsync() e getURI()
  };

  const enviarRelato = async () => {
    if (!titulo.trim() || !descricao.trim() || !localizacao.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha o título, a descrição e a localização do ocorrido.');
      return;
    }
    setIsSubmitting(true);
    try {
      const body = {
        titulo: titulo.trim(),
        tipo: 'Relato',
        descricao: descricao.trim(),
        latitude: latitude || 0.0,
        longitude: longitude || 0.0,
      };
      console.log('Enviando relato:', body);
      const response = await fetch('http://192.168.0.236:8000/alertas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const responseText = await response.text();
      console.log('Resposta do backend:', responseText);
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Erro ao fazer parse da resposta:', e);
        throw new Error('Erro ao processar resposta do servidor');
      }
      if (!response.ok) {
        throw new Error(responseData.detail || 'Erro ao enviar relato');
      }
      // Salvar relato localmente (sem a foto)
      await AsyncStorage.setItem('ultimoRelato', JSON.stringify({ descricao, localizacao, latitude, longitude }));
      Alert.alert('Sucesso', 'Seu relato foi enviado com sucesso!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Erro', `Falha ao enviar relato: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.content}>
        <Text style={styles.titulo}>Novo Relato</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Título do ocorrido</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite um título curto para o relato..."
            placeholderTextColor="#999999"
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

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
          <TouchableOpacity style={styles.botaoImagem} onPress={tirarFoto}>
            {foto ? (
              <Image source={{ uri: foto }} style={styles.imagem} />
            ) : (
              <View style={styles.placeholderImagem}>
                <Ionicons name="camera" size={30} color="#999999" />
                <Text style={styles.textoPlaceholder}>Toque para tirar uma foto</Text>
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
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333333',
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
    maxHeight: 250,
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
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  botaoEnviar: {
    marginTop: 20,
  },
  loadingIndicator: {
    marginLeft: 10,
  },
});

export default Relato; 