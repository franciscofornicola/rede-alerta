import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ScreenHeader = ({
  title,
  showBackButton = false,
  rightIconName,
  onRightIconPress,
  style,
}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container, style]}>
      {showBackButton && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      </View>
      {rightIconName && (
        <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
          <MaterialIcons name={rightIconName} size={24} color="#333" />
        </TouchableOpacity>
      )}
      {!showBackButton && !rightIconName && <View style={styles.placeholder} />} {/* Placeholder para alinhar o título */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F4F4F4', // Cor de fundo padrão, pode ser sobrescrita
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 5,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  rightIcon: {
     padding: 5,
  },
  placeholder: {
    width: 34, // Largura aproximada de um ícone + padding
  }
});

export default ScreenHeader; 