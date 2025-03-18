import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StatusBar, View, StyleSheet, Dimensions, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Surface } from 'react-native-paper';
import { BlurView } from 'expo-blur';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 96 : 80;
const { width } = Dimensions.get('window');

// Custom header component
function HeaderTitle() {
  return (
    <Surface style={styles.headerSurface} elevation={0}>
      <View style={styles.iconContainer}>
        <Image source={require('../../assets/icon.png')} style={styles.headerIcon} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitleQ}>Q</Text>
        <Text style={styles.headerTitle}>reserv</Text>
      </View>
    </Surface>
  );
}

export default function ReservationTabsLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4A00E0" translucent={true} />
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4A00E0',
            height: HEADER_HEIGHT,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: '#fff',
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 88 : 75,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -8,
            },
            shadowOpacity: 0.1,
            shadowRadius: 24,
            paddingBottom: Platform.OS === 'ios' ? 28 : 16,
            paddingTop: 12,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: '#4A00E0',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
          },
          headerTitle: () => <HeaderTitle />,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.tabIconContainer}>
                <MaterialCommunityIcons
                  name={color === '#4A00E0' ? 'home' : 'home-outline'}
                  size={size}
                  color={color}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="make-reservation"
          options={{
            title: 'Book',
            tabBarIcon: ({ color, size }) => (
              <View style={[styles.tabIconContainer, styles.mainTabIcon]}>
                <MaterialCommunityIcons
                  name={color === '#4A00E0' ? 'calendar-clock' : 'calendar-clock-outline'}
                  size={size + 4}
                  color={color}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
            tabBarIcon: ({ color, size }) => (
              <View style={styles.tabIconContainer}>
                <MaterialCommunityIcons
                  name={color === '#4A00E0' ? 'calendar' : 'calendar-outline'}
                  size={size}
                  color={color}
                />
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  headerSurface: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    gap: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: Platform.OS === 'ios' ? 12 : 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleQ: {
    fontSize: 26,
    fontWeight: '800',
    color: '#EEF2FF',
    letterSpacing: 0.5,
    marginRight: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    letterSpacing: 1,
  },
  iconContainer: {
    position: 'relative',
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  tabIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  mainTabIcon: {
    backgroundColor: '#EEF2FF',
    transform: [{ translateY: -8 }],
    borderRadius: 25,
    width: 50,
    height: 50,
    shadowColor: '#4A00E0',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
});
