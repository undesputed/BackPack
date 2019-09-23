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
    TextInput,
    RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Logo from '../component/logo';
import axios from 'axios';
import addAddress from './addAddress';
import { NavigationActions, StackActions } from 'react-navigation';


export class Address extends Component{
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
            phone: '',
            refreshing: false
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

    addDetails(){
        this.setState({showModal:false});
    }

    _onRefresh = () =>{
        this.setState({refreshing:true});
        this.fetchUser().then(() => {
            this.setState({refreshing:false})
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                <View style={styles.subContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('addAddress')}>
                        <Text style={{color: 'skyblue'}}><Icon name="add" size={25}/> Add Address</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height: 5, backgroundColor: '#ccc', width: '100%'}}/>
                {
                    this.state.user.map((item,i) =>{
                        return(                 
                            <View>
                                <View style={{height: 5, backgroundColor: '#ccc', width: '100%'}}/>                                
                                    <TouchableOpacity onPress={() => this.updateAddress(item.details_id)}>
                                        <View style={styles.contentContainer}>
                                            <View style={{flex:1,flexDirection: 'row'}}>
                                                <View style={{paddingLeft: 10}}>
                                                    <Icon name="location-on" color='skyblue' size={25}/>
                                                </View>
                                                <View style={{flex:1, paddingLeft: 10}}>
                                                    <Text>{item.user_address}</Text>
                                                    <Text>{item.user_postal_code}</Text>
                                                    <Text>{item.user_email}</Text>
                                                    <Text>{item.user_phone}</Text>
                                                </View>
                                            </View>
                                        </View>  
                                    </TouchableOpacity>
                            </View>
                        );
                    })
                }
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


export default class App extends Component{
    render(){
        return(
            <AppContainer/>
        );
    }
  }
  
  const AppStackContainer = createStackNavigator({
      Address: Address,
      addAddress: addAddress
    }
  );
  
  const AppContainer = createAppContainer(AppStackContainer);