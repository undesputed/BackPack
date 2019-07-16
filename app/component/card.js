import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, StatusBar, ScrollView, Button} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class Card extends Component {
    static navigationOptions = {
        header: null
    }
    render() {
        return(
            <View style={styles.container}>
                <TouchableOpacity style={styles.card}>
                    <Image
                        style={styles.cardImage}
                        source={{uri:''}}
                    />
                    <Text style={styles.cardText}>Card Title</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop: 20,
        backgroundColor: '#F5FcFF'
    },
    card: {
        backgroundColor: '#fff',
        marginBottom:10,
        marginLeft:'2%',
        width: '96%',
        shadowColor: '#000',
        shadowOpacity:0.2,
        shadowRadius:1,
        shadowOffset:{
            width:3,
            height:3
        }
    },
    cardImage: {
        width: '100%',
        height:200,
        resizeMode:'cover'
    },
    cardText:{
        padding:10,
        fontSize: 16
    }
});