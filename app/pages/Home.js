import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, StatusBar, ScrollView, Button} from 'react-native';
import Icon from 'react-native-vector-icons';
import Logo from '../component/logo';
import Registration from '../component/registration';
import RegisterLogo from '../component/registerLogo';

export default class Homes extends Component {
    static navigationOptions = {
        title: 'Home Page'
    }
    render() {
        const {goBack} = this.props.navigation;
        return (
          <View style={styles.container}>
            <View style={styles.signUpText}>
                <Text style={styles.textSignUp}>Welcome To BakBak</Text>
                <Text style={styles.textSignUp}>{ this.props.navigation.state.params.Email }</Text>
                <Button title = "Logout" onPress={() => goBack(null)}></Button>
            </View>
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
    },
    signUpText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginVertical: 16,
        flexDirection: 'row'
    },
    textSignUp: {
        color : 'rgba(255,255,255,0.6)',
        fontSize: 16
    },
    signUpButton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500'
    }
});