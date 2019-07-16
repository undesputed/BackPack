import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, VScrolliew, TextInput, TouchableOpacity, ScrollView, View, Alert} from 'react-native';
import Button from 'apsl-react-native-button';

export default class Registration extends Component {
    constructor(props){
        super(props);
        this.state = {
            firstName:'',
            lastName:'',
            address:'',
            phoneNumber:'',
            userName:'',
            password:''
        };
    }

    userRegister = () =>{
        const {firstName} = this.state;
        const {lastName} = this.state;
        const {address} = this.state;
        const {phoneNumber} = this.state;
        const {userName} = this.state;
        const {password} = this.state;
        var url = 'http://192.168.43.35:80/adminBakpak/android/userSignup.php';
        var data = {
            fname: firstName,
            lname: lastName,
            address: address,
            phone: phoneNumber,
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
                fname: firstName,
                lname: lastName,
                address: address,
                phone: phoneNumber,
                username: userName,
                password: password
            }),
        }).then(res => res.json())
            .then((response) => {
                // this.props.navigation.navigate('Login');
                alert(response);
            })
            .catch((error) => {
                console.error(error)
            });
    }
    render(){
        return(
            <ScrollView>
                <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)' placeholder="First Name"
                placeholderTextColor="#ffffff"
                onChangeText = {firstName => this.setState({firstName})}/>
                <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)' placeholder="Last Name"
                placeholderTextColor="#ffffff"
                onChangeText = {lastName => this.setState({lastName})}/>
                <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)' placeholder="Address"
                placeholderTextColor="#ffffff"
                onChangeText = {address => this.setState({address})}/>
                <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)' placeholder="Phone Number"
                placeholderTextColor="#ffffff"
                onChangeText = {phoneNumber => this.setState({phoneNumber})}/>
                <TextInput style={styles.inputBox}
                underlineColorAndroid='rgba(0,0,0,0)' placeholder="Username/Email"
                placeholderTextColor="#ffffff"
                onChangeText = {userName => this.setState({userName})}/>
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