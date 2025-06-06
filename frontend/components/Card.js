import React from 'react';
import { View, StyleSheet } from 'react-native';

const Card = ({
  children,
  style,
  ...
}) => {
  return (
    <View style={[styles.card, style]} {...}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card; 