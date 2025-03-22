import React from 'react';
import { Tabs } from 'expo-router';
import { Platform, StatusBar, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Surface, Avatar, Menu } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';
import { Redirect } from 'expo-router';
import { HeaderTitle } from '../../components/HeaderTitle';
import { UserAvatar } from '../../components/ui/UserAvatar';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 96 : 80;
const { width } = Dimensions.get('window');

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = React.useState(false);

  // If user is not authenticated, redirect to auth
  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4A00E0" translucent={true} />
      <View style={styles.header}>
        <HeaderTitle />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.profileButton}>
              {user && <UserAvatar user={user} size={40} />}
            </TouchableOpacity>
          }
        >
          <Menu.Item leadingIcon="account" title={user.name} style={styles.menuItem} />
          <Menu.Item leadingIcon="email" title={user.email} style={styles.menuItem} />
          <Menu.Item
            leadingIcon="logout"
            onPress={() => {
              setMenuVisible(false);
              signOut();
            }}
            title="Sign Out"
          />
        </Menu>
      </View>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#4A00E0',
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'My Bookings',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-check" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="make-reservation"
          options={{
            title: 'Reserve',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-plus" size={26} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" size={26} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: '#4A00E0',
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  profileButton: {
    marginLeft: 8,
  },
  menuItem: {
    maxWidth: 300,
  },
});
