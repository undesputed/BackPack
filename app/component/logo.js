import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, StatusBar} from 'react-native';

export default class Logo extends Component {
    render(){
        return(
            <View style={styles.container}>
            <Image style={{width: 150, height:150}} source={require('../images/bakpaklogo.png')}/>
            <Text style={styles.textLogo}>Welcome to BakPak</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textLogo: {
        marginVertical: 15,
        fontSize: 18,
        color: 'rgba(255,255,255,0.7)'
    }
});