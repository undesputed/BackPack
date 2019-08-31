import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl
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
    this.fetchUser();
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
      <View style={styles.container}>
        {
          this.state.data.map((item,i) => {
            return(
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
                    <Text style={styles.name}>{item.user_fname} {item.user_lname}</Text>
                    <TouchableOpacity onPress={this.updateAddress}>
                      <Text style={styles.info}>{item.user_phone}/{item.user_email}</Text>
                      <Text style={styles.description}>{item.user_address} {item.user_postal_code}</Text>
                    </TouchableOpacity>
                    <View style={styles.detailBody}>
                      <View style={styles.item}>
                        <TouchableOpacity style={styles.infoContent}>
                            <Text style={styles.info}><Icon name="home" size={20} /> Home</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.item}>
                        <TouchableOpacity style={styles.infoContent} onPress={() => this.props.navigation.navigate('updateProf')}>
                          <Text style={styles.info}><Icon name="update" size={20} /> Update Profile</Text>
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
            );
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: "#ccc",
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
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
    backgroundColor: '#ccc',
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