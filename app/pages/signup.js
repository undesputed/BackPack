import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, StatusBar, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons';
import Logo from '../component/logo';
import Registration from '../component/registration';
import RegisterLogo from '../component/registerLogo';

export default class Signup extends Component {
    static navigationOptions = {
        header: null
    }
    render() {
        return (
          <View style={styles.container}>
            <RegisterLogo/>
            <Registration type="Signup"/>
            <View style={styles.signUpText}>
                <Text style={styles.textSignUp}>Already have an account? </Text>
                <Text styel={styles.signUpButton} onPress={() => this.props.navigation.navigate('Login')}>Sign in</Text>
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