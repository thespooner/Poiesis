import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import {GlobalStyles} from "../constants/styles";

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/Poiesis_Logo_bg.png')} style={styles.logo} />
            <Text style={styles.text}>Poiesis, from Ancient Greek: ποίησις </Text>
            <Text style={styles.text}>The activity in which a person brings something into being that did not exist before.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#232355',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 100,
        height: 100,
    },
    text: {
        marginTop: 20,
        color: GlobalStyles.colors.text,
        fontSize: 24,
    }
});

export default SplashScreen;
