import React from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';
import {GlobalStyles} from "../constants/styles";
import {useNavigation} from "@react-navigation/native";

const SplashScreen = () => {
    const navigation = useNavigation();
    return (

        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <View style={styles.iconContainer}>
                    <Image source={require('../assets/Poiesis_Logo_bg.png')} style={styles.logo}/>
                </View>
                <Text style={styles.text}>Poiesis, from Ancient Greek: ποίησις </Text>
                <Text style={styles.text}>The activity in which a person brings </Text>
                <Text style={styles.text}>something into being that did</Text>
                <Text style={styles.text}>not exist before.</Text>
            </Pressable>
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
    iconContainer: {
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
