import React from 'react';
import { Tabs, usePathname } from 'expo-router';
import { Platform, StatusBar, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, Surface, Avatar, Menu, Badge } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useAuth } from '../features/auth/AuthContext';
import { Redirect } from 'expo-router';
import { HeaderTitle } from '../../components/HeaderTitle';
import { UserAvatar } from '../../components/ui/UserAvatar';
import { useAppSelector } from '../../store/hooks';

const HEADER_HEIGHT = Platform.OS === 'ios' ? 96 : 80;
const { width } = Dimensions.get('window');

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { currentBusiness } = useAppSelector(state => state.user);
  const pathname = usePathname();
  // If user is not authenticated, redirect to auth
  if (!user) {
    console.log('User not authenticated, redirecting to auth screen');
    return <Redirect href="/(auth)" />;
  }
  // Determine if user is a business owner, default to customer if role is not set
  const isBusinessOwner = user?.role === 'business' || false;
  
  // Get the current screen title based on pathname
  const getCurrentScreenTitle = () => {
    const route = pathname.split('/').pop() || 'index';
    
    switch (route) {
      case 'index':
        return isBusinessOwner ? 'Dashboard' : 'Home';
      case 'dashboard':
        return 'Dashboard';
      case 'business-reservations':
        return 'Reservations';
      case 'bookings':
        return 'My Bookings';
      case 'make-reservation':
        return 'Make a Reservation';
      case 'profile':
        return 'Profile';
      default:
        return '';
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4A00E0" translucent={true} />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <HeaderTitle />
        </View>
        
        <View style={styles.headerCenter}>
          <Text style={styles.screenTitle}>
            {getCurrentScreenTitle()}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.profileButton}>
                <View>
                  {user && <UserAvatar user={user} size={40} />}
                  {isBusinessOwner && <Badge style={styles.businessBadge}>B</Badge>}
                </View>
              </TouchableOpacity>
            }
          >
            <Menu.Item leadingIcon="account" title={user.name} style={styles.menuItem} />
            <Menu.Item leadingIcon="email" title={user.email} style={styles.menuItem} />
            {isBusinessOwner && currentBusiness && (
              <Menu.Item 
                leadingIcon="store" 
                title={`${currentBusiness.name} (Business)`}
                style={styles.menuItem}
              />
            )}
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
            title: isBusinessOwner ? 'Dashboard' : 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons 
                name={isBusinessOwner ? "view-dashboard" : "home"} 
                size={26} 
                color={color} 
              />
            ),
          }}
        />
        
        {/* Hide dashboard as a separate tab - it will be rendered inside index for business users */}
        <Tabs.Screen
          name="dashboard"
          options={{
            href: null, // This prevents it from showing in the tab bar
          }}
        />
          <Tabs.Screen
          name="business-reservations"
          options={{
            title: 'Reservations',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-multiple-check" size={26} color={color} />
            ),
            href: isBusinessOwner ? undefined : null, // Show for business owners, hide for regular users
          }}
        />        <Tabs.Screen
          name="bookings"
          options={{
            title: 'My Bookings',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-check" size={26} color={color} />
            ),
            href: isBusinessOwner ? null : undefined, // Hide for business owners, show for regular users
          }}
        />        <Tabs.Screen
          name="make-reservation"
          options={{
            title: 'Reserve',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="calendar-plus" size={26} color={color} />
            ),
            href: isBusinessOwner ? null : undefined, // Hide for business owners, show for regular users
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
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  screenTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileButton: {
    marginLeft: 8,
  },
  menuItem: {
    maxWidth: 300,
  },
  businessBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FF9500',
  },
  businessDescription: {
    color: '#4A00E0',
    fontWeight: 'bold',
  }
});
