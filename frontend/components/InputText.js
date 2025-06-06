import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

const InputText = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry = false,
  multiline = false,
  numberOfLines,
  style,
  ...
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style, multiline && styles.multilineInput]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        placeholderTextColor="#A0A0A0"
        {...}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  }
});

export default InputText; 