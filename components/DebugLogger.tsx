import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// Create a context for the logger
const LoggerContext = createContext<{
  logs: string[];
  addLog: (log: string) => void;
  clearLogs: () => void;
}>({
  logs: [],
  addLog: () => {},
  clearLogs: () => {},
});

// Custom hook to use the logger
export const useLogger = () => {
  return useContext(LoggerContext);
};

// Logger provider component
export const LoggerProvider = ({ children }: { children: React.ReactNode }) => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Save original console.log
    const originalConsoleLog = console.log;

    // Override console.log
    console.log = (...args: any[]) => {
      // Call original console.log first
      originalConsoleLog(...args);
      
      // Add to our logs in a way that doesn't cause render issues
      const log = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (error) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      
      const timestamp = new Date().toISOString().substr(11, 8); // HH:MM:SS
      
      // Use a timeout to defer the state update and avoid render phase issues
      setTimeout(() => {
        setLogs(prevLogs => [...prevLogs, `[${timestamp}] ${log}`].slice(-100));  // Keep last 100 logs
      }, 0);
    };

    // Restore original console.log when component unmounts
    return () => {
      console.log = originalConsoleLog;
    };
  }, []); // Empty dependency array since we don't want this to re-run
  const addLog = (log: string) => {
    const timestamp = new Date().toISOString().substr(11, 8); // HH:MM:SS
    setLogs(prevLogs => [...prevLogs, `[${timestamp}] ${log}`].slice(-100));  // Keep last 100 logs
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <LoggerContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </LoggerContext.Provider>
  );
};

// Debug overlay component
export const DebugOverlay = () => {
  const { logs, clearLogs } = useLogger();
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Small button to show/hide logs */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setVisible(!visible)}
      >
        <Text style={styles.toggleButtonText}>📋</Text>
      </TouchableOpacity>

      {/* Log display */}
      {visible && (
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Debug Logs</Text>
            <TouchableOpacity onPress={clearLogs}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.logsContainer}>
            {logs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 20,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  clearButton: {
    color: '#ff6347',
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#4a9aff',
    fontWeight: 'bold',
  },
  logsContainer: {
    flex: 1,
    padding: 10,
  },
  logText: {
    color: '#33ff33',
    fontFamily: 'monospace',
    fontSize: 12,
    marginBottom: 2,
  },
});
