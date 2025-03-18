import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AppIcon() {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="calendar-check" size={120} color="#FFFFFF" />
        <View style={styles.textContainer}>
          <Text style={styles.text}>Q</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 1024,
    height: 1024,
    backgroundColor: '#4A00E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 800,
    height: 800,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    bottom: 60,
    right: 60,
    width: 120,
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  text: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#4A00E0',
  },
});
