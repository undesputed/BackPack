import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View, 
        Image, 
        StatusBar, 
        TextInput, 
        AsyncStorage
    } from 'react-native';
import { createMaterialTopTabNavigator,createStackNavigator } from 'react-navigation';
import shipping from '../payment/shipping';
import payment from '../payment/payment';
import confirmation from '../payment/confirmation';

const AppNavigator = createMaterialTopTabNavigator(
    {
        Shipping: shipping,
        Payment: payment,
        Confirmation: confirmation
    }
)

export default AppNavigator