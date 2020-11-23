import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import Button from 'apsl-react-native-button';
import { createStackNavigator } from 'react-navigation';

export default class Form extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    userLogin = () => {
        const {username,password} = this.state;
        var url = 'http://192.168.43.35/adminBakpak/android/loginUser.php';
        var data = {
            user : username,
            pass : password
        }

        fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                user : username,
                pass : password
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson === 'Login Successfull'){
                    alert(responseJson);
                    // this.props.navigation.navigate('Home', {Email : user});
                }else{
                    alert(responseJson);
                }
            }).catch((error) => {
                console.error(error);
            })
    }

    render(){
        return(
            <View style={styles.container}>
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Username"
                    placeholderTextColor="#ffffff"
                    onChangeText = {username => this.setState({username})}
                    returnKeyType = "next"
                    onSubmitEditing = {() => this.passwordInput.focus()}
                    autoCapitalize = "none"
                    autoCorrect = {false}/>
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    secureTextEntry={true} placeholder="Password"
                    placeholderTextColor="#ffffff"
                    onChangeText = {password => this.setState({password})}
                    ref = {(input) => this.passwordInput =input}/>

                <Button style={styles.buttonStyle8}
                        textStyle={styles.textStyle8}
                        onPress={this.userLogin}>
                    <View style={styles.customViewStyle}>
                        <Text style={{fontFamily: 'Avenir', color:'white'}}>
                        LOGIN
                        </Text>
                    </View>
                </Button>
                {/* <TouchableOpacity style={styles.buttonStyle}>
                    <Text onPress={this.userLogin} style={styles.buttonLogin}>{this.props.type}</Text>
                </TouchableOpacity> */}
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
        textAlign: 'center'
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