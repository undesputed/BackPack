import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    ScrollView,
    Button
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export default class from extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Notification</Text>
            </View>
        );
    }
}

const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccc'
    }
});