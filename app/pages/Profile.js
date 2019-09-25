import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
  ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/AntDesign';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import updateProf from './updateProfile';
import history from './history';
import address from './address';

const Window = {
  Width:Dimensions.get("window").width,
  Height:Dimensions.get("window").height
}

export class Profile extends Component {

  _isMounted = false;

  static navigationOptions = {
    header: null
}

  constructor(props){
    super(props);
    this.state={
      data: [],
      refreshing: false
    }
  }

  fetchUser = async() => {
    const id = await AsyncStorage.getItem('user_id');
    const response = await fetch('http://192.168.43.35:8080/getUser/'+id);
    const user = await response.json();
    this.setState({data:user})
  }

  componentDidMount(){
    this._isMounted = true;
    this.fetchUser();
  }

  componentWillUnmount(){
    this._isMounted= false;
  }

  updateAddress = async() => {
      this.props.navigation.navigate('Address');
  }

  _onRefresh =() =>{
    this.setState({refreshing: true});
    this.fetchUser().then(()=>{
      this.setState({refreshing: false})
    });
}

  render() {
    return (
                  <ImageBackground source={require('../images/bg.png')} style={{width: '100%', height: '100%'}}>
      <View style={styles.container}>
              <ScrollView showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
              >
              <View style={{flex:1}}>
                <View style={styles.header}></View>
                <Image style={styles.avatar} source={require('../images/user_avatar.png')}/>
                <View style={styles.body}>
                  <View style={styles.bodyContent}>
                  {
                    this.state.data.map((item,i) => {
                      return(
                        <View>
                          <Text style={styles.name}>{item.user_fname} {item.user_lname}</Text>
                          <TouchableOpacity onPress={this.updateAddress}>
                            <Text style={styles.info}>{item.user_phone}/{item.user_email}</Text>
                            <Text style={styles.description}>{item.user_address} {item.user_postal_code}</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })
                  }
                  <TouchableOpacity onPress={this.updateAddress}>
                    <Text style={{fontSize: 15,alignSelf: 'center', color: 'skyblue'}}>Add Address ++</Text>
                  </TouchableOpacity>
                    <View style={styles.detailBody}>
                      <View style={styles.item}>
                        <TouchableOpacity style={styles.infoContent}>
                            <Text style={styles.info}><Icon name="home" size={20} /> Home</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.item}>
                        <TouchableOpacity style={styles.infoContent} onPress={() => this.props.navigation.navigate('History')}>
                          <Text style={styles.info}><Icon name="description" size={20} /> History</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.item}>
                        <TouchableOpacity style={styles.infoContent}>
                          <Text style={styles.info}><Icons name="logout" size={20} /> Logout</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              </ScrollView>
      </View>
                </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:50
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:170,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "white",
    fontWeight: "600",
    alignSelf: 'center'
  },
  info:{
    fontSize:16,
    color: "black",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "white",
    marginTop:10,
    textAlign: 'center'
  },
  detailBody: {
    width: Window.Width,
    height: 200,
    padding: 10
  },
  item: {
    flexDirection: 'row'
  },
  infoContent:{
    flex:1,
    alignItems:'flex-start',
    paddingLeft:5,
    height:45,
    flexDirection: 'row',
    marginBottom:10,
    width:250,
    backgroundColor: 'white',
    borderRadius: 5
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
    Profile: Profile,
    updateProf: updateProf,
    History: history,
    Address: address
  }
);

const AppContainer = createAppContainer(AppStackContainer);