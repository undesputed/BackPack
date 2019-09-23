import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimension,
    StatusBar,
    Modal,
    TextInput
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Logo from '../component/logo';
import axios from 'axios';


export default class Address extends Component{
    static navigationOptions = {
        header: null
    }

    constructor(props){
        super(props);
        this.state= {
            user: [],
            detail_id: '',
            showModal: false,
            fname: '',
            lname: '',
            addr: '',
            postal_code: '',
            email: '',
            phone: ''
        }
    }

    fetchUser = async() => {
        const id = await AsyncStorage.getItem('user_id');
        const response = await fetch('http://192.168.43.35:8080/getUserDetails/'+id);
        const getUser = await response.json();
        this.setState({user:getUser});
    }

    componentDidMount(){
        this.fetchUser();
    }

    updateAddress(details_id){
        user_status = 'ACTIVE'
        var url = 'http://192.168.43.35:8080/updateDetailsByStatus/'+user_status;
        axios.post(url).then(function(response){
            console.log(response)
        }).then(function(error){
            console.log(error);
        })
        var detail = 'http://192.168.43.35:8080/updateDetailsById/'+details_id;
        axios.post(detail).then(function(response){
            console.log(response);
        }).then(function(error){
            console.log(error);
        })
        this.props.navigation.goBack();
    }

    addDetails = async() =>{
        const {fname,lname,addr,postal_code,email,phone} = this.state;
        const user_id = await AsyncStorage.getItem('user_id');
        var sql = 'http://192.168.43.35:8080/insertUserDetails';
        axios.post(sql,{
            fname:fname,
            lname:lname,
            addr:addr,
            postal_code:postal_code,
            email:email,
            phone:phone,
            user_id:user_id
        }).then(function(response){
            console.log(response);
        }).then(function(error){
            console.log(error);
        });
        this.props.navigation.goBack();
    }

    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                <View style={{flex:1, backgroundColor:'gray', alignItems: 'center'}}>
                    <Icon name="location-on" color='skyblue' size={50} style={{alignSelf: 'center',paddingTop: 10,paddingBottom: 20}}/>
                    <Text style={{alignSelf: 'center', fontSize: 20, color: 'white', fontWeight: 'bold'}}>Add Details</Text>
                    <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="First Name"
                        placeholderTextColor="#ffffff"
                        onChangeText = {fname => this.setState({fname})}
                        returnKeyType = "next"
                        onSubmitEditing = {() => this.lnameInput.focus()}
                        autoCapitalize = "none"
                        autoCorrect = {false}/>
                    <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Last Name"
                        placeholderTextColor="#ffffff"
                        onChangeText = {lname => this.setState({lname})}
                        returnKeyType = "next"
                        onSubmitEditing = {() => this.addressInput.focus()}
                        autoCapitalize = "none"
                        autoCorrect = {false}
                        ref = {(input) => this.lnameInput =input}/>
                    <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Address"
                        placeholderTextColor="#ffffff"
                        onChangeText = {addr => this.setState({addr})}
                        returnKeyType = "next"
                        onSubmitEditing = {() => this.postalInput.focus()}
                        autoCapitalize = "none"
                        autoCorrect = {false}
                        ref = {(input) => this.addressInput =input}/>
                    <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Postal Code"
                        placeholderTextColor="#ffffff"
                        onChangeText = {postal_code => this.setState({postal_code})}
                        returnKeyType = "next"
                        onSubmitEditing = {() => this.phoneInput.focus()}
                        autoCapitalize = "none"
                        autoCorrect = {false}
                        ref = {(input) => this.postalInput =input}/>
                    <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Email"
                        placeholderTextColor="#ffffff"
                        onChangeText = {email => this.setState({email})}
                        returnKeyType = "next"
                        onSubmitEditing = {() => this.phoneInput.focus()}
                        autoCapitalize = "none"
                        autoCorrect = {false}
                        ref = {(input) => this.postalInput =input}/>
                    <TextInput style={styles.inputBox}
                        underlineColorAndroid='rgba(0,0,0,0)'
                        placeholder="Phone"
                        placeholderTextColor="#ffffff"
                        onChangeText = {phone => this.setState({phone})}
                        returnKeyType = "next"
                        autoCapitalize = "none"
                        autoCorrect = {false}
                        ref = {(input) => this.phoneInput =input}/>
                    <TouchableOpacity onPress={this.addDetails} style={{borderRadius: 10,height: 40, width:'95%', backgroundColor: '#ccc',alignItems:'center'}}>
                        <Text style={{paddingTop: 5,fontSize: 20,fontWeight: 'bold'}}>Add</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        backgroundColor: '#ccc',
        alignContent: 'center'
    },
    subContainer:{
        width: '95%',
        height: 40,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 5,
    },
    contentContainer:{
        width: '95%',
        height:100,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 5,
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
});