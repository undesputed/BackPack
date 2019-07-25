import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View, 
        Image, 
        StatusBar, 
        TextInput, 
        AsyncStorage,
        Dimensions
    } from 'react-native';
import Reinput from 'reinput';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Window = {
    Width:Dimensions.get("window").width,
    Height:Dimensions.get("window").height
}

export default class updateProfile extends Component {

    static navigationOptions = {
        title: 'Update Profile'
    }

    constructor(props){
        super(props);
        this.state={
            data:[],
            user_fname: '',
            user_lname: '',
            user_address: '',
            postal_code: '',
            user_email: '',
            user_phone: '',
            user_username: '',
            user_password: ''
        }
    }

    fetchUser = async() => {
        const id = await AsyncStorage.getItem('user_id');
        const response = await fetch('http://192.168.43.35:8080/getUser/'+id);
        const user = await response.json();
        this.setState({data:user});
    }

    componentDidMount() {
        this.fetchUser();
    }

    updateUser = async() => {
        const id = await AsyncStorage.getItem('user_id');
        alert(id);
    }

    render() {
        return (
          <View style={StyleSheet.container}>
              {
                  this.state.data.map((item,i) => {
                      return(
                          <ScrollView>
                            <View style={{flexGrow: 1,justifyContent: 'center',
                            alignItems: 'center'  }}>
                                    <Image style={{width: 150, height:150, paddingTop: 20, paddingRight: 20, borderRadius: 100}} source={require('../images/user_avatar.png')}/>
                                    <Reinput label={item.user_fname} style={{ paddingRight:20, paddingLeft: 20}}/>
                                    <Reinput label={item.user_lname} style={{ paddingRight:20, paddingLeft: 20}}/>
                                    <Reinput label={item.user_address} style={{ paddingRight:20, paddingLeft: 20}}/>
                                    <Reinput label={item.user_postal_code} style={{ paddingRight:20, paddingLeft: 20}}/>
                                    <Reinput label={item.user_email} style={{ paddingRight:20, paddingLeft: 20}}/>
                                    <Reinput label={item.user_phone} style={{ paddingRight:20, paddingLeft: 20}}/>
                                    <Reinput label={item.user_username} style={{ paddingRight:20, paddingLeft: 20}}/>
                                    <Reinput label={item.user_password} style={{ paddingRight:20, paddingLeft: 20}}/>
                                    <Reinput label='Confirm Password' style={{ paddingRight:20, paddingLeft: 20}}/>
                                    <Button
                                        icon={
                                            <Icon name="update" size={25}/>
                                        }
                                        title=" Update"
                                        type="outline"
                                        onPress={this.updateUser}
                                    />
                            </View>
                          </ScrollView>
                      );
                  })
              }
          </View>   
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccc'
    },
});