import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, VScrolliew, TextInput, TouchableOpacity, ScrollView, View, Alert} from 'react-native';
import RegisterLogo from '../component/registerLogo';
import Button from 'apsl-react-native-button';

export default class Signup extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props){
        super(props);
        this.state = {
            userName:'',
            password:''
        };
    }

    userRegister = () =>{
        const {userName} = this.state;
        const {password} = this.state;
        var url = 'http://192.168.43.35:80/adminBakpak/android/userSignup.php';
        var data = {
            username: userName,
            password: password
        };

        fetch(url,{
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: userName,
                password: password
            }),
        }).then(res => res.json())
            .then((response) => {
                this.props.navigation.navigate('Login');
                alert(response);
            })
            .catch((error) => {
                console.error(error)
            });
    }

    render() {
        return (
          <View style={styles.container}>
            <RegisterLogo/>
            <ScrollView>
                <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)' placeholder="Username/Email"
                placeholderTextColor="#ffffff"
                onChangeText = {userName => this.setState({userName})}
                autoCapitalize="none"/>
                <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)' secureTextEntry={true} placeholder="Password"
                placeholderTextColor="#ffffff"
                onChangeText = {password => this.setState({password})}/>
                {/* <TouchableOpacity style={styles.buttonStyle}> */}
                    {/* <Button onPress={this.userRegister} title="SignUp" style={styles.buttonLogin}/> */}
                    <Button style={styles.buttonStyle8}
                        textStyle={styles.textStyle8}
                        onPress={this.userRegister}>
                    <View style={styles.customViewStyle}>
                        <Text style={{fontFamily: 'Avenir', color:'white'}}>
                        SIGNUP
                        </Text>
                    </View>
                    </Button>
                {/* </TouchableOpacity> */}
            </ScrollView>
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
    },
    inputBox: {
        width: 300,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 10
    },
    buttonStyle:{
        backgroundColor: '#1c313a',
        borderRadius: 25,
        width: 300,
        marginVertical: 10,
        paddingVertical: 12
    },  
    buttonLogin: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
        borderRadius: 25
    },
    buttonStyle8: {
        backgroundColor: '#1c313a',
        borderColor: '#333',
        borderWidth: 2,
        borderRadius: 25,
      },
    textStyle8: {
        width: 200,
        fontFamily: 'Avenir Next',
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
    },
    customViewStyle: {
        width: 120,
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 30,
        flexDirection: 'row',
    }
});