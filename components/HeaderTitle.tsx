import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';

export const HeaderTitle = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/icon.png')} style={styles.icon} />
      <View style={styles.titleContainer}>
        <Text style={styles.titleQ}>Q</Text>
        <Text style={styles.title}>RESERV</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  titleQ: {
    fontSize: 26,
    fontWeight: '800',
    color: '#EEF2FF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});
