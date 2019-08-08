import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View, 
        Image, 
        StatusBar, 
        TextInput, 
        Dimensions,
        ScrollView,
        RefreshControl,
        TouchableOpacity
    } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class Confirmation extends Component {

    constructor(props){
        super(props);
        this.state={
            items: [],
            total: '',
            user: [],
            refreshing: false
        }
    }

    fetchData = async() => {
        const id = await AsyncStorage.getItem('user_id');
        const response = await fetch('http://192.168.43.35:8080/userCart/'+id);
        const item = await response.json();
        this.setState({items:item});
    }

    fetchUser = async() => {
        const id = await AsyncStorage.getItem('user_id');
        const response = await fetch('http://192.168.43.35:8080/getUser/'+id);
        const user = await response.json();
        this.setState({user:user})
    }

    componentDidMount(){
        this.fetchData();
        this.fetchUser();
    }

    _onRefresh = () =>{
        this.setState({refreshing: true});
        this.fetchData().then(()=>{
            this.setState({refreshing: false})
        });
    }
    ItemSepartor = () =>{
        return (
            <View
                style={{height: 0.5,
                    paddingBottom: 5,
                width: Window.width - 20,
            backgroundColor: '#ccc'}}
            />
        );
    }
    
    placeOrder = async() => {
        const user_id = await AsyncStorage.getItem('user_id');
        let total = 0;
        //kind payment
        const {navigation} = this.props;
        const type = navigation.getParam('payment','N/A');
        const payment = JSON.stringify(type);
        
        var day = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var date = date+year;
        var order_date = year+ '-' + month + '-' + day;
        
        let code = 0;
        const beg_code = '2111';
        
        const status = 'Pending';
        this.state.items.forEach((item) => {
        
            code += 1;
        // totalPrice += item.quantity * item.unit_price;
        //     //insert delivery
        //     var delivery = 'http://192.168.43.35:8080/insertDelivery';
        //     axios.post(delivery,{
        //         delivery_date: order_date,
        //         delivery_status: status,
        //         user_id:user_id,
        //         item_id:item_id,
        //         order_code:order_code
        //     }).then(function(response){
        //         console.log(response);
        //     }).then(function(error){
        //         console.log(error);
        //     })
        //     //insert history
        //     var history = 'http://192.168.43.35:8080/insertHistory';
        //     axios.post(history,{
        //         order_code:order_code,
        //         hist_date:order_date,
        //         item_id:item_id,
        //         user_id:user_id
        //     })
        });
        // alert(code);
        let order_code = beg_code+user_id+type+day+code;
        this.state.items.forEach((item) =>{
            let quantity = item.quantity;
            const item_id = item.item_id;
            total = quantity * item.unit_price;
            let totalPrice = total;
            alert(quantity);
            var order = 'http://192.168.43.35:8080/insertOrder';
            axios.post(order,{
                order_code:order_code,
                order_date:order_date,
                order_totalPrice:totalPrice,
                order_quantity:quantity,
                user_id:user_id,
                item_id:item_id,
                payement:payment,
                status:status
            }).then(function(response){
                console.log(response);
            }).then(function(error){
                console.log(error);
            });
        });

    }

    render() {
        return (
          <View style={styles.container}>
              <ScrollView>
                <View style={{flex: 1, height: 125, width: Window.width, flexDirection: 'row'}}>
                    <View style={{padding: 10}}>
                        <Icon name="location" color='skyblue' size={25}/>
                    </View>
                    <TouchableOpacity>
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
                    </TouchableOpacity>
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
                        <Icon name="credit" size={25}/>
                    </View>
                    <View style={{paddingTop: 10,paddingRight: 10}}>
                        <Text style={{fontWeight: '300',fontSize: 16}}>Payment Method:</Text>
                    </View>
                    <View style={{paddingTop: 10}}>
                        <Text style={{fontWeight: 'bold'}}>COD(Cash On Delivery)</Text>
                    </View>
                </View>
                <View style={{height:3,width: Window.width,backgroundColor:'#B0CBDF',paddingBottom: 3}}/>
                <View style={{height:3,width: Window.width,backgroundColor:'white',paddingBottom: 3}}/>
                <TouchableOpacity onPress={this.placeOrder}>
                    <View style={{height: 40,width:Window.width - 10, backgroundColor: 'skyblue',alignSelf:'center',borderRadius: 5}}>
                        <Text style={{alignSelf: 'center',padding:10,fontSize:18,fontWeight: 'bold'}}>Place Order</Text>
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
        backgroundColor: '#ffffff'
    },
});