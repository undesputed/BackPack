import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import { createAppContainer, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import AppNavigator from './lib/router';

const AppIndex = createAppContainer(AppNavigator);

export default class CheckOut extends Component{
    static navigationOptions = {
        title: 'Checkout'
    }
    render(){
        return(
            <View style={styles.wrapper}>
                <AppIndex/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper:{
        flex: 1,
        paddingBottom: 5
    },
});