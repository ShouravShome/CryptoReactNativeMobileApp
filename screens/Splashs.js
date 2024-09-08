import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import login from "../static/login.png"
import { useNavigation } from '@react-navigation/core';

export default function SplashScreen(){
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            navigation.push("Login")
        }, 2000); // Adjust the duration as needed
    }, []);

    return (
        <View style={styles.container}>
            <Image source={login} style={styles.image} />
            <Text style={styles.textStyle}> Welcome To Crypto Currency!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    textStyle: {
        fontSize: 20,
        fontWeight: "500",
        alignSelf: "center"
    }
});