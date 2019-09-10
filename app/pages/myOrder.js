import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View, 
        Image, 
        StatusBar, 
        TextInput, 
        AsyncStorage,
        Dimensions,
        TouchableOpacity
    } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const Window = {
    Width:Dimensions.get("window").width,
    Height:Dimensions.get("window").height
}

export default class MyOrder extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        title: navigation.state.params.orderCode
      });

      constructor(props){
          super(props);
          this.state = {
              items: [],
              refreshing: false,
              user: []
          }
      }

      fetchItems = async() => {
          const {navigation} = this.props;
          const orderCode = navigation.getParam('orderCode','N/A');
          const response = await fetch('http://192.168.43.35:8080/geItemsByOrder/'+orderCode);
          const item = await response.json();
          this.setState({items:item}); 
      }

      fetchUser = async() => {
        const id = await AsyncStorage.getItem('user_id');
        const response = await fetch('http://192.168.43.35:8080/getUser/'+id);
        const users = await response.json();
        this.setState({user:users})
    }

      componentDidMount(){
          this.fetchItems();
          this.fetchUser();
      }

      cancelOrder = () => {
          const {navigation} = this.props;
          const orderCode = navigation.getParam('orderCode','N/A');
          const status = 'Cancelled';
          var sql = 'http://192.169.43.35:8080/cancelOrder/'+status+'/'+orderCode;
          axios.post(sql).then(function(response){
              console.log(response);
          }).then(function(error){
              console.log(error);
          });
          alert(status);
        //   alert('Order Cancelled');
        //   this.props.navigation.goBack();
      }

      _onRefresh = () =>{
          this.setState({refreshing:true});
          this.fetchItems().then(() => {
              this.setState({refreshing:false});
          });
          this.fetchUser().then(() =>{
              this.setState({refreshing:false});
          });
      }

    render() {
        const {navigation} = this.props;
        const payment = navigation.getParam('payment','N/A');
        return (
          <View style={styles.container}>
            <ScrollView>
                <View style={{flex: 1, height: 125, width: Window.width, flexDirection: 'row'}}>
                    <View style={{padding: 10}}>
                        <Icon name="location-on" color='skyblue' size={25}/>
                    </View>
                    <View>
                        {
                            this.state.user.map((item, i) => {
                                return(
                                    <View style={{flex: 1,paddingTop: 10}}>
                                        <Text style={{fontWeight: 'bold'}}>{item.user_fname} {item.user_lname}</Text>
                                        <Text style={{fontWeight: 'bold'}}>{item.user_address}</Text>
                                        <Text style={{fontWeight: 'bold'}}>{item.user_postal_code}</Text>
                                        <Text style={{fontWeight: 'bold'}}>{item.user_email}</Text>
                                        <Text style={{fontWeight: 'bold'}}>{item.user_phone}</Text>
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
                <View style={{height:3,width: Window.width,backgroundColor:'#B0CBDF',paddingBottom: 3}}/>
                <View style={{height: 40, width: Window.width,backgroundColor:'#F0F0F0',flex:1,flexDirection: 'row'}}>
                    <View style={{padding: 10}}>
                        <Icons name="package" size={25}/>
                    </View>
                    <View style={{paddingTop:10}}>
                        <Text style={{fontWeight:'300'}}>Items</Text>
                    </View>
                </View>
                <View style={{height:3,width: Window.width,backgroundColor:'#B0CBDF',paddingBottom: 3}}/>
                <View style={{height:3,width: Window.width,backgroundColor:'#D6D9E5',paddingBottom: 3}}/>
                <View style={{flex: 1,}}>
                    {
                        this.state.items.map((item,i) => {
                            return(
                                <View style={{flex: 1, width: Window.width, flexDirection: 'row'}}>
                                    <View style={{padding:10}}>
                                        <Image
                                            style={{width:100,height:100,resizeMode:'stretch'}}
                                            source={{uri:item.item_image}}
                                        />
                                    </View>
                                    <View style={{paddingTop:10, flex:1}}>
                                        <Text style={{fontWeight: '400'}}>{item.item_name}</Text>
                                        <Text style={{fontWeight: '400'}}>Brand: {item.item_brand}</Text>
                                        <Text>₱ {item.unit_price}</Text>
                                        <Text style={{position: 'absolute', right: 20, bottom: 10}}>x{item.quantity}</Text>
                                    </View>
                                </View>
                            );
                        })
                    }
                </View>
                <View style={{height:3,width: Window.width,backgroundColor:'#B0CBDF',paddingBottom: 3}}/>
                <View style={{flex:1, flexDirection: 'row',backgroundColor:'#F0F0F0'}}>
                    <View style={{paddingTop:10,paddingLeft:10,paddingBottom:10}}>
                        <Icons name="credit-card" size={25}/>
                    </View>
                    <View style={{paddingTop: 10,paddingRight: 10}}>
                        <Text style={{fontWeight: '300',fontSize: 16}}>Payment Method:</Text>
                    </View>
                    <View style={{paddingTop: 10}}>
                        <Text style={{fontWeight: 'bold'}}>{payment}</Text>
                    </View>
                </View>
                <View style={{height:3,width: Window.width,backgroundColor:'#B0CBDF',paddingBottom: 3}}/>
                <View style={{height:3,width: Window.width,backgroundColor:'white',paddingBottom: 3}}/>
                <TouchableOpacity onPress={this.cancelOrder}>
                    <View style={{height: 40,width:Window.Width - 10, backgroundColor: 'skyblue',alignSelf:'center',borderRadius: 5}}>
                        <Text style={{alignSelf: 'center',padding:10,fontSize:18,fontWeight: 'bold'}}>Cancel Order</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
          </View>
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccc'
    }
});