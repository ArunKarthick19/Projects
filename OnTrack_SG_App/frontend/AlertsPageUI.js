import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import axios from 'axios';
import { Ionicons } from 'react-native-vector-icons';

// Use appropriate IP based on development environment
// For emulators:
// - Android emulator: 10.0.2.2 points to host machine's localhost
// - iOS simulator: localhost works
const SERVER_IP = Platform.select({
  ios: 'localhost',
  android: '10.0.2.2', // Android emulator special IP
});

// If using a physical device, you'll need to use your computer's actual IP on the network
//const SERVER_IP2 = '192.168.1.100'; // Replace with your actual IP

const SERVER_URL = `http://192.168.18.11:5000`;
console.log(`Using server URL: ${SERVER_URL}`);

const AlertsPageUI = () => {
  const [alerts, setAlerts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAlerts, setExpandedAlerts] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Function to test API connectivity
  const testApiConnection = async () => {
    try {
      setConnectionStatus('checking');
      const response = await axios.get(`${SERVER_URL}/api/test`, { timeout: 5000 });
      console.log('API test response:', response.data);
      setConnectionStatus('connected');
      return true;
    } catch (error) {
      console.error('API test error:', error);
      setConnectionStatus('failed');
      return false;
    }
  };
//YEOWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
  const testBasicFetch = async () => {
    try {
      console.log(`Testing basic fetch to ${SERVER_URL}/api/test`);
      const response = await fetch(`${SERVER_URL}/api/test`);
      const text = await response.text();
      console.log('Basic fetch response text:', text);
      try {
        const json = JSON.parse(text);
        console.log('Parsed JSON response:', json);
        Alert.alert('Fetch Test Successful', 
          `Connected to server!\nResponse: ${JSON.stringify(json, null, 2)}`);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        Alert.alert('Fetch Successful but Invalid JSON', 
          `Server responded but with invalid JSON:\n${text.substring(0, 200)}`);
      }
      return true;
    } catch (error) {
      console.error('Basic fetch failed:', error.message);
      Alert.alert('Fetch Test Failed', 
        `Error: ${error.message}\nURL: ${SERVER_URL}/api/test`);
      return false;
    }
  };

  const fetchAlerts = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // First test if the API is running
      const isConnected = await testApiConnection();
      
      if (!isConnected) {
        setError(`Cannot connect to server at ${SERVER_URL}. Please check if the server is running and your network connection.`);
        setRefreshing(false);
        setLoading(false);
        return;
      }
      
      // Fetch the actual alerts
      console.log(`Fetching alerts from ${SERVER_URL}/api/service-alerts`);
      const response = await axios.get(`${SERVER_URL}/api/service-alerts`, {
        timeout: 10000 // 10 second timeout
      });
      
      console.log("API Response:", response.data);
      
      if (response.data && response.data.data) {
        setAlerts(response.data.data);
      } else {
        console.warn("Unexpected API response format:", response.data);
        setAlerts([]);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
      
      // Provide more specific error messages
      if (error.code === 'ECONNABORTED') {
        setError(`Request timed out. The server at ${SERVER_URL} is taking too long to respond.`);
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error (${error.response.status}): ${error.response.data.error || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError(`No response from server. Please check if the server is running at ${SERVER_URL}.`);
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const toggleExpandAlert = (index) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getLineColor = (line) => {
    const lineColors = {
      'NSL': '#D42E12',
      'EWL': '#009645',
      'NEL': '#9900AA',
      'CCL': '#FA9E0D', 
      'DTL': '#005EC4',
      'TEL': '#9D5B25',
      'BPL': '#A0522D',  // Bukit Panjang LRT
      'PEL': '#878787',  // Punggol LRT East Loop
      'PWL': '#878787',  // Punggol LRT West Loop
      'SEL': '#878787',  // Sengkang LRT East Loop
      'SWL': '#878787',  // Sengkang LRT West Loop
      'CEL': '#FA9E0D',  // Circle Line Extension
      'CGL': '#009645',  // Changi Extension
    };
    
    if (!line) return '#7f8c8d';
    
    for (const [key, color] of Object.entries(lineColors)) {
      if (line.includes(key)) {
        return color;
      }
    }
    
    return '#7f8c8d';  // Default gray
  };

  const getSeverityColor = (severity) => {
    const severityColors = {
      'Normal': '#2ecc71',  // Green
      'Delay': '#f39c12',   // Orange
      'Disruption': '#e74c3c', // Red
      'Closure': '#e74c3c',   // Red
      'Error': '#e74c3c',     // Red
      'Unknown': '#7f8c8d',   // Gray
    };
    
    return severityColors[severity] || '#7f8c8d';
  };

  // Format timestamp to be more readable
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return timestamp; // If invalid date, return original
      
      return date.toLocaleString();
    } catch (error) {
      console.warn("Date formatting error:", error);
      return timestamp;
    }
  };

  // Show connection status
  const renderConnectionStatus = () => {
    if (connectionStatus === 'checking') {
      return (
        <View style={styles.connectionStatus}>
          <ActivityIndicator size="small" color="#2196F3" />
          <Text style={styles.connectionText}>Checking server connection...</Text>
        </View>
      );
    } else if (connectionStatus === 'failed') {
      return (
        <View style={styles.connectionStatus}>
          <Ionicons name="cloud-offline" size={16} color="#e74c3c" />
          <Text style={[styles.connectionText, {color: '#e74c3c'}]}>
            Server connection failed
          </Text>
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {renderConnectionStatus()}
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading service alerts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderConnectionStatus()}
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service Alerts</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchAlerts}
        >
          <Ionicons name="refresh" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchAlerts}
          />
        }
      >
        {error ? (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={36} color="#e74c3c" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchAlerts}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={() => Alert.alert(
                'Debug Info',
                `Server URL: ${SERVER_URL}\nConnection Status: ${connectionStatus}`
              )}
            >
              <Text style={styles.debugButtonText}>Show Debug Info</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.debugButton}
                onPress={testBasicFetch}
              >
                <Text style={styles.debugButtonText}>Test Basic Fetch</Text>
               
            </TouchableOpacity>

          </View>
          //YEOWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
        ) : alerts.length === 0 ? (
          <View style={styles.noAlertsCard}>
            <Ionicons name="checkmark-circle" size={48} color="#2ecc71" />
            <Text style={styles.noAlertsText}>No active service alerts</Text>
            <Text style={styles.noAlertsSubtext}>All train lines operating normally</Text>
          </View>
        ) : (
          alerts.map((alert, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.alertCard,
                { borderLeftColor: getLineColor(alert.affected_lines) }
              ]}
              onPress={() => toggleExpandAlert(index)}
            >
              <View style={styles.alertHeader}>
                <Text style={styles.alertTitle}>
                  {alert.affected_lines || 'Unknown'}
                </Text>
                <View style={[
                  styles.severityBadge, 
                  {backgroundColor: getSeverityColor(alert.severity)}
                ]}>
                  <Text style={styles.severityText}>{alert.severity || 'Info'}</Text>
                </View>
              </View>
              
              <Text style={styles.alertMessage} numberOfLines={expandedAlerts[index] ? 0 : 2}>
                {alert.message || 'No details available'}
              </Text>
              
              {expandedAlerts[index] && (
                <View style={styles.stationsContainer}>
                  {alert.stations && alert.stations.length > 0 && (
                    <>
                      <Text style={styles.stationsHeader}>Affected Stations:</Text>
                      <Text style={styles.stationsText}>{alert.stations.join(', ')}</Text>
                    </>
                  )}
                  
                  {alert.direction && alert.direction !== 'Unknown' && (
                    <Text style={styles.directionText}>
                      <Ionicons name="navigate" size={14} color="#7f8c8d" /> Direction: {alert.direction}
                    </Text>
                  )}
                  
                  {alert.shuttle_direction && (
                    <Text style={styles.directionText}>
                      <Ionicons name="git-branch" size={14} color="#7f8c8d" /> Shuttle Direction: {alert.shuttle_direction}
                    </Text>
                  )}
                  
                  {alert.free_public_bus && (
                    <Text style={styles.transportText}>
                      <Ionicons name="bus" size={16} color="#2196F3" /> Free public bus available
                    </Text>
                  )}
                  
                  {alert.free_mrt_shuttle && (
                    <Text style={styles.transportText}>
                      <Ionicons name="train" size={16} color="#2196F3" /> Free MRT shuttle available
                    </Text>
                  )}
                </View>
              )}
              
              <View style={styles.alertFooter}>
                <Text style={styles.alertTime}>
                  {formatTimestamp(alert.timestamp)}
                </Text>
                <Ionicons 
                  name={expandedAlerts[index] ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color="#7f8c8d" 
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#2196F3',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    marginBottom: 5,
  },
  connectionText: {
    fontSize: 12,
    marginLeft: 5,
    color: '#2196F3',
  },
  refreshButton: {
    padding: 10,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 5,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  stationsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  stationsHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stationsText: {
    fontSize: 14,
    marginBottom: 5,
  },
  directionText: {
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
    color: '#555',
  },
  transportText: {
    fontSize: 14,
    marginTop: 5,
    color: '#2196F3',
  },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  noAlertsCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 30,
    margin: 12,
    elevation: 2,
    alignItems: 'center',
  },
  noAlertsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#2ecc71',
  },
  noAlertsSubtext: {
    fontSize: 14,
    marginTop: 5,
    color: '#7f8c8d',
  },
  errorCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 30,
    margin: 12,
    elevation: 2,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
    color: '#7f8c8d',
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  debugButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  debugButtonText: {
    color: '#7f8c8d',
    fontWeight: 'bold',
  }
});

export default AlertsPageUI;