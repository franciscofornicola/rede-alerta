import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const MenuItemCard = ({
  title,
  subtitle,
  iconName,
  bgColor,
  iconBgColor,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: bgColor }]} onPress={onPress}>
      <View style={[styles.menuIconContainer, { backgroundColor: iconBgColor }]}>
        <MaterialIcons name={iconName} size={24} color="#FFFFFF" />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
    backgroundColor: '#FFFFFF', // Fallback color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#3478F6', // Fallback color
  },
  menuTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#555555',
  },
});

export default MenuItemCard; 