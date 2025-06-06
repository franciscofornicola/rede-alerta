import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card'; // Reutilizando o componente Card
import { MaterialIcons } from '@expo/vector-icons';

const InfoCard = ({
  title,
  subtitle,
  iconName,
  iconColor = '#333',
  children,
  style,
}) => {
  return (
    <Card style={[styles.infoCard, style]}>
      <View style={styles.contentContainer}>
        {iconName && (
          <MaterialIcons name={iconName} size={24} color={iconColor} style={styles.icon} />
        )}
        <View style={styles.textContainer}>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          {children} {/* Permite adicionar conteúdo customizado dentro do card */}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    // Estilos padrão do Card já aplicados, pode adicionar estilos específicos aqui
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  icon: {
    marginRight: 15,
    marginTop: 4, // Ajuste vertical para alinhar com o texto
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#555555',
  },
});

export default InfoCard; 