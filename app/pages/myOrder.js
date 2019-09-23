import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View, 
        Image, 
        StatusBar, 
        TextInput,
        Dimensions,
        TouchableOpacity
    } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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
              user: [],
              date: [],
              setDate: ''
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
        
      fetchDate = async() => {
          const {navigation} = this.props;
          const orderCode = navigation.getParam('orderCode','N/A');
          const response = await fetch('http://192.168.43.35:8080/getDateByOrder/'+orderCode);
          const getDate = await response.json();
          this.setState({date:getDate});
      }

      componentDidMount(){
          this.fetchItems();
          this.fetchUser();
          this.fetchDate();
      }

      cancelOrder = () => {
          const {navigation} = this.props;
          const orderCode = navigation.getParam('orderCode','N/A');
          const status = 'CANCELLED';
          var sql = 'http://192.168.43.35:8080/cancelOrder/'+status+'/'+orderCode;
          axios.post(sql).then(function(response){
              console.log(response);
          }).then(function(error){
              console.log(error);
          });
          var sql2 = 'http://192.168.43.35:8080/cancelDelivery/'+status+'/'+orderCode;
          axios.get(sql2).then(function(response){
            console.log(response);
          }).then(function(error){
            console.log(error);
          });
          alert('Order Cancelled');
          this.props.navigation.goBack();
      }

      delivered = async() =>{
        const user_id = await AsyncStorage.getItem('user_id');
        const {navigation} = this.props;
        const orderCode = navigation.getParam('orderCode','N/A');
        var day = new Date().getDate();
        var month = new Date().getMonth()+1;
        var year = new Date().getFullYear();
        var date = year+'-'+month+'-'+day;
        var updateOrder = 'http://192.168.43.35:8080/deliveredOrders/'+orderCode+'/'+user_id;
        axios.post(updateOrder).then(function(response){
            console.log(response);
        }).then(function(error){
            console.log(error);
        })
        var updateDelivery = 'http://192.168.43.35:8080/deliveredDelivery/'+orderCode+'/'+user_id;
        axios.post(updateDelivery).then(function(response){
            console.log(response);
        }).then(function(error){
            console.log(error);
        });
        var setHistory = 'http://192.168.43.35:8080/setHistory';
        axios.post(setHistory,{
            order_code: orderCode,
            hist_date: date,
            user_id: user_id
        }).then(function(response){
            console.log(response);
        }).then(function(error){
            console.log(error);
        })
        this.props.navigation.goBack();
      }

      renderButton(){
        const {navigation} = this.props;
        const status = navigation.getParam('status', 'N/A');
        const orderCode = navigation.getParam('orderCode','N/A');
        const payment = navigation.getParam('payment','N/A');
        var day = new Date().getDate();
        var month = new Date().getMonth()+1;
        var year = new Date().getFullYear();
        var date = year+'-'+month+'-'+day;
            if(status == 'ON THE WAY'){
                // this.onTheWay();
                return <TouchableOpacity onPress={this.delivered}><View style={{height: 40,width:Window.Width - 10, backgroundColor: 'pink',alignSelf:'center',borderRadius: 5}}>
                        <Text style={{alignSelf: 'center',padding:10,fontSize:18,fontWeight: 'bold'}}>DELIVERED</Text>
                    </View></TouchableOpacity>
            }else if(status == 'PENDING' || payment == 'COD'){
                return <TouchableOpacity onPress={this.cancelOrder}><View style={{height: 40,width:Window.Width - 10, backgroundColor: 'skyblue',alignSelf:'center',borderRadius: 5}}>
                        <Text style={{alignSelf: 'center',padding:10,fontSize:18,fontWeight: 'bold'}}>Cancel Order</Text>
                    </View></TouchableOpacity>
            }else if(status == 'CANCELLED'){
                return <View style={{height: 40,width:Window.Width - 10, backgroundColor: 'pink',alignSelf:'center',borderRadius: 5}}>
                        <Text style={{alignSelf: 'center',padding:10,fontSize:18,fontWeight: 'bold'}}>CANCELLED</Text>
                    </View>
            }else if(status == 'PENDING' || payment == 'Paypal'){
                return <View style={{height: 40,width:Window.Width - 10, backgroundColor: 'pink',alignSelf:'center',borderRadius: 5}}>
                        <Text style={{alignSelf: 'center',padding:10,fontSize:18,fontWeight: 'bold'}}>Cannot Cancel</Text>
                    </View>
            }
    }

    onTheWay(){
        var day = new Date().getDate();
        var month = new Date().getMonth()+1;
        var year = new Date().getFullYear();
        var date = year+'-'+month+'-'+day;
        this.state.date.forEach((item) => {
            this.setState({setDate:item.delivery_date});
        })        
        if(date == this.state.setDate){
            alert('Hello World');
            // return <TouchableOpacity><View style={{height: 40,width:Window.Width - 10, backgroundColor: 'orange',alignSelf:'center',borderRadius: 5}}>
            //         <Text style={{alignSelf: 'center',padding:10,fontSize:18,fontWeight: 'bold'}}>DELIVERED</Text>
            //     </View></TouchableOpacity>
        }else{
            alert('world');
            // return <View style={{height: 40,width:Window.Width - 10, backgroundColor: 'pink',alignSelf:'center',borderRadius: 5}}>
            //         <Text style={{alignSelf: 'center',padding:10,fontSize:18,fontWeight: 'bold'}}>ON THE WAY</Text>
            //     </View>
        }
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
                                        <Text style={{position: 'absolute', right: 20, bottom: 10}}>x{item.order_quantity}</Text>
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
                <View style={{flex: 1}}>
                    {this.renderButton()}
                </View>
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