import { StatusBar } from 'expo-status-bar';

import LoginForm from "../my_app/screens/LoginScreen";
import RegistrationForm from './screens/registration';
import HowTo from './screens/HowTO';

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import CoinDetails from './screens/CoinDetails';
import { LoggerProvider } from './contexts/LoggerProvider';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/Splashs';
const Stack = createStackNavigator();

export default function App() {
  return (
    <View style={styles.container}>
      <LoggerProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ animationEnabled: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginForm} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegistrationForm} options={{ headerShown: false }} />
            <Stack.Screen name="Dashboard" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={CoinDetails} />
            <Stack.Screen name="How To" component={HowTo} options={{ headerShown: true }} />
          </Stack.Navigator>
        </NavigationContainer>
        {/* <Text>Open up App.js to start working on your app!</Text> */}
        <StatusBar style="auto" />
      </LoggerProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
