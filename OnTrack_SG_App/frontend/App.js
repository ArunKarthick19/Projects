import React from 'react';
import { Ionicons } from 'react-native-vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomePageUI from './HomePageUI';
import AlertsScreen from './AlertsPageUI';

const Tab = createBottomTabNavigator();
//Lol
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'map' : 'map-outline';
              } else if (route.name === 'Alerts') {
                iconName = focused ? 'alert-circle' : 'alert-circle-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#1102db',
            tabBarInactiveTintColor: 'gray',
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomePageUI}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Alerts"
            component={AlertsScreen}
            options={{ title: 'Service Alerts' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}