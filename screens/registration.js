import { StatusBar } from 'expo-status-bar';

import login from "../static/login.png";

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

import { useNavigation } from '@react-navigation/core';



export default function RegistrationForm() {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const API_URL = "http://172.22.25.50:3000";
    async function register() {
        try {
            const url = `${API_URL}/users/register`
            let res = await fetch(url, {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            if (res.status === 202) {
                console.log('User exist');
                // Handle successful registration
                Alert.alert('Error', 'User already exists!!!')
                setEmail("")
                setPassword("")
            }
            else if (res.status === 201) {
                console.log('User registered successfully');
                // Handle successful registration
                Alert.alert('Success', 'User registered successfully', [
                    { text: 'OK', onPress: () => navigation.navigate('Login') },
                ]);
                
            } else {
                console.log('Registration failed');
                // Handle failed registration
            }
        }

        catch {

        }
    }

    const handleLogIn = () => {
        navigation.navigate("Login")
    }

    const handleSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Please provide a valid email address!');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Password must be at least 8 characters long!');
            return;
        }
        // navigation.navigate("Dashboard");
        register();



        // Clear email and password fields
        setEmail("");
        setPassword("");
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={login} style={styles.logo} />
            </View>
            <Text style={styles.title}>Currency Converter</Text>
            <View style={styles.box}>

                <View>
                    <Text style={{ fontWeight: "bold" }}>Email</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                        required
                    />

                    <Text style={{ fontWeight: "bold" }}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        required
                    />
                    <TouchableOpacity
                        style={styles.buttonSignUp}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonLogin}
                        onPress={handleLogIn}
                    >
                        <Text style={styles.buttonText}>Already have account?</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    box: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        margin: 40
    },
    logoContainer: {

        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 100,
    },
    logo: {
        width: 250,
        height: 250,
    },
    title: {
        alignSelf: 'center',
        fontSize: 25,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        borderRadius: 10,
    },
    buttonLogin: {
        backgroundColor: 'blue',
        padding: 15,
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonSignUp: {
        backgroundColor: 'red',
        padding: 15,
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
});