import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, StatusBar, ScrollView, Button} from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import tabBarIcon from '../component/tabBarIcon';
import HomePage from './HomePage';
import Cart from './Cart';
import Order from './Order';
import Profile from './Profile';
import Category from './category';

export default class Home extends Component {
    static navigationOptions = {
        header: null
    }
    render() {
        return(
            <AppContainer/>
        );
    }
}

const BottomTabMaterial = createMaterialBottomTabNavigator(
    {
      Home:{
          screen: HomePage,
          navigationOptions: {
              tabBarIcon: tabBarIcon('home')
          }
      },
      Cart:{
          screen:Cart,
          navigationOptions:{
              tabBarIcon: tabBarIcon('add-shopping-cart')
          }
        },
      Order:{
          screen:Order,
          navigationOptions:{
              tabBarIcon: tabBarIcon('track-changes')
          }
        },
      Profile:{
          screen:Profile,
          navigationOptions:{
              tabBarIcon: tabBarIcon('account-box')
          }
        }
    },
    {
      shifting: false,
      activeColor: '#6200ee',
      inactiveColor: '#828792',
      barStyle: {
        backgroundColor: '#f8f7f9',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderStyle: 'solid',
        borderColor: '#d0cfd0',
      },
    }
  );

const AppContainer = createAppContainer(BottomTabMaterial);