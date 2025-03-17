import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AppLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4A00E0" translucent={true} />
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4A00E0',
          },
          headerTintColor: '#fff',
          tabBarStyle: {
            height: 65,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            paddingBottom: Platform.OS === 'ios' ? 20 : 10,
            paddingTop: 10,
          },
          tabBarActiveTintColor: '#4A00E0',
          tabBarInactiveTintColor: '#666666',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name={color === '#4A00E0' ? 'home' : 'home-outline'}
                size={size}
                color={color}
              />
            ),
            headerTitle: 'Quick Reservation',
            headerTitleAlign: 'center',
            headerLeft: () => (
              <MaterialCommunityIcons
                name="calendar-check"
                size={24}
                color="white"
                style={{ marginLeft: 16 }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="make-reservation"
          options={{
            title: 'Book',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name={color === '#4A00E0' ? 'calendar-clock' : 'calendar-clock-outline'}
                size={size}
                color={color}
              />
            ),
            headerTitle: 'Make Reservation',
            headerTitleAlign: 'center',
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'My Bookings',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name={color === '#4A00E0' ? 'calendar' : 'calendar-outline'}
                size={size}
                color={color}
              />
            ),
            headerTitle: 'My Bookings',
            headerTitleAlign: 'center',
          }}
        />
      </Tabs>
    </>
  );
}
