import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export const AuthDebugger = () => {
  const [authState, setAuthState] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    addLog(`Starting auth debugger on ${Platform.OS}`);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthState({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerData: user.providerData,
        });
        addLog(`Firebase Auth: User signed in - ${user.email}`);
      } else {
        setAuthState(null);
        addLog('Firebase Auth: User signed out');
      }
    });

    return unsubscribe;
  }, []);

  if (__DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Auth Debug Info</Text>
        <ScrollView style={styles.logContainer}>
          <Text style={styles.sectionTitle}>Auth State:</Text>
          <Text style={styles.text}>
            {authState ? JSON.stringify(authState, null, 2) : 'No authenticated user'}
          </Text>
          
          <Text style={styles.sectionTitle}>Logs:</Text>
          {logs.map((log, index) => (
            <Text key={index} style={styles.logText}>{log}</Text>
          ))}
        </ScrollView>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 1000,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    padding: 8,
    textAlign: 'center',
  },
  logContainer: {
    flex: 1,
    padding: 8,
  },
  sectionTitle: {
    color: 'yellow',
    fontWeight: 'bold',
    marginTop: 8,
  },
  text: {
    color: 'white',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  logText: {
    color: 'lightgreen',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
