import login from "../static/login.png";

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

export default function HowTo() {
    return (
        <View style={styles.logoContainer}>
            <Image source={login} style={styles.logo}></Image>
            <Text style={styles.titleStyle}>Welcome To CryproCurrency App</Text>
            <View style={styles.anotherContainer}>
                <Text style={styles.textStyle}> 1. If you are new to our app. Please signup using email! </Text>
                <Text style={styles.textStyle}> 2. Search from your favourite list of Crypto.</Text>
                <Text style={styles.textStyle}> 3. Add Crypto to your list to keep in touch with valuable information of that crypto.</Text>
                <Text style={styles.textStyle}> 4. You can delete crypto from that list.</Text>
                <Text style={styles.textStyle}> 5. Click on the crypto to see it's details.</Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    logoContainer: {

        
        marginBottom: 20,
        marginTop: 50,
    },
    logo: {
        alignSelf:'center',
        width: 250,
        height: 250,
      },
    titleStyle: {
        alignSelf: 'center',
        fontSize: 30,
        fontWeight:"600"
    },
    anotherContainer: {
        alignSelf: 'center',
        marginLeft: 50,
        marginRight:50,
        marginTop: 20,
    },
    textStyle: {
        alignSelf: 'center',
        fontSize: 20,
        fontWeight:"300"
    },

})
