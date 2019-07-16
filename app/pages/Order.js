import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, StatusBar, ScrollView, Button} from 'react-native';

export default class Order extends Component {
    render() {
        return(
            <View style={styles.container}>
                <Text>Order</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#455a64',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});