import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View, 
        Image, 
        StatusBar, 
        ScrollView, 
        Button,
        SafeAreaView,
        FlatList,
        TouchableOpacity,
        RefreshControl,
        Dimensions,
        CheckBox,
        ImageBackground,
        TextInput
    } from 'react-native';
import { SearchBar } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import NumericInput from 'react-native-numeric-input';
import axios from 'axios';
import Swipeout from 'react-native-swipeout';
import Icon from "react-native-vector-icons/MaterialIcons";
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import MyOrder from './myOrder';
import checkout from './checkout';
import Icons from 'react-native-vector-icons/Ionicons';

const Window = {
    Width:Dimensions.get("window").width,
    Height:Dimensions.get("window").height
}

export class Cart extends Component {
    
    _isMounted = false;

    static navigationOptions = {
        header: null
    }

    componentWillMount() {
        this.startHeadHeight = 80
        if(Platform.OS == 'android'){
            this.startHeadHeight = 100 + StatusBar.currentHeight
        }
    }

    constructor(props){
        super(props);
        this.state = {
            search: '',
            data: [],
            refreshing: false,
            checked: true,
            unchecked: false,
            activeRowKey: null,
            quantity: 0,
            qty:0,
            item: []
        };
    }

    getUser = async()=>{
        const id = await AsyncStorage.getItem('user_id');
        alert(id);
    }

    fetchCart = async()=>{
        const id = await AsyncStorage.getItem('user_id');
        const response = await fetch('http://192.168.43.35:8080/userCart/'+id);
        const cart = await response.json();
        this.setState({data:cart});
    }

    fetchItem = async()=> {
        const itemID = await AsyncStorage.getItem('item_id');
        const response = await fetch('http://192.168.43.35:8080/byItem/'+itemID);
        const getitem = await response.json();
        this.setState({item:getitem});
    }

    componentDidMount(){
        this._isMounted=true;
        this.fetchCart();
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    updateSearch = search => {
    this.setState({ search });
    };

    _onRefresh = () =>{
        this.setState({refreshing: true});
        this.fetchCart().then(()=>{
            this.setState({refreshing: false})
        });
    }

    ItemSepartor = () =>{
        return (
            <View
                style={{height: 10,
                width: "100%"}}
            />
        );
    }

    deleteItem(id){
        const cart_id = id
        var url = 'http://192.168.43.35:8080/deleteCart';
        axios.post(url,{
            cart_id:cart_id
        }).then(function (response){
            console.log(response);
        }).then(function (error){
            console.log(error);
        });
        alert('Item Deleted');
    }

    __onChecked = () =>{
        this.setState({checked: false});
    }

    selectAllItem(){
        this.setState({
            checked:false
        })
    }

    _onPressItem(id){
        alert(id);
    }

    buyNow = () => {
        this.props.navigation.push('Checkout');
    }

    minus = (cart_id, item_quantity,quantity) => {
        if(quantity < 1){
            alert('Error quantity');
        }else{
            var sql = 'http:/192.168.43.35:8080/minusQty/'+cart_id;
            axios.post(sql).then(function(response){
                console.log(response);
            }).then(function(error){
                console.log(error);
            })
            this.setState({refreshing:true});
            this.fetchCart().then(()=>{
                this.setState({refreshing:false});
            })
        }
    }

    add(cart_id,item_quantity,quantity){
        if(quantity >= item_quantity){
            alert('Exceeds Stock On Hand');
        }else{
            var sql = 'http://192.168.43.35:8080/addQty/'+cart_id;
            axios.post(sql).then(function(response){
                console.log(response);
            }).then(sql).then(function(error){
                console.log(error);
            })
            this.setState({refreshing:true});
            this.fetchCart().then(()=>{
                this.setState({refreshing: false})
            });
        }
    }

    render() {
        const { search } = this.state;
        const { checked } = this.state;
        return(
            <ImageBackground source={require('../images/bg.png')} style={{width: '100%', height: '100%'}}> 
                <SafeAreaView style={{flex:1}}>
                    <View style={{flex:1}}>
                        <View style={{ height: 58,
                                        borderBottomWidth:1,
                                        borderBottomColor:'#dddddd'}}>
                            <SearchBar
                                placeholder="Type Here..."
                                onChangeText={this.updateSearch}
                                value={search}
                            />
                        </View>
                        <View style={{ flex: 1,  paddingTop: 10}}>
                            <Text style={{fontSize:24, fontWeight: '700', paddingHorizontal: 20, color: 'white'}}>
                                <Icon name="shopping-cart" size={25} color='white'/>
                                Cart 
                            </Text>
                                <View style={{alignSelf: 'center',height:1,width: '90%',backgroundColor:'white'}}/>
                            <View style={{ height: 130, marginTop: 20, flex:1}}>
                                    <FlatList
                                        data={this.state.data}
                                        ItemSeparatorComponent={this.ItemSepartor}
                                        keyExtractor={(item,index) => index.toString()}
                                        renderItem={({item}) =>
                                        <View style={styles.contianer}>
                                            <Swipeout right={[
                                                    {
                                                    text: 'Delete',
                                                    backgroundColor: 'red',    
                                                    underlayColor: 'rgba(255, 0, 0, 1, 0.6)',
                                                    onPress: () => this.deleteItem(item.cart_id)
                                                    }
                                                ]}
                                                autoClose={true}
                                                backgroundColor= 'transparent'>
                                                    <View style={styles.cartContainer}>
                                                        <View style={styles.imageContainer}>
                                                            <Image
                                                                style={styles.image}
                                                                source={{uri:item.item_image}}
                                                            />
                                                        </View>
                                                        <View style={styles.contentContainer}>
                                                            <Text style={styles.itemName}>{item.item_name}</Text>
                                                                <Text style={{fontWeight: '400',fontSize: 15}}>QTY: <Icons onPress={() => this.minus(item.cart_id,item.item_quantity,item.quantity)} name="ios-arrow-dropleft-circle" size={35}/>   {() => this.setState({quantity:item.quantity})}{item.quantity}   <Icons onPress={() => this.add(item.cart_id,item.item_quantity,item.quantity)} name="ios-arrow-dropright-circle" size={35}/></Text>
                                                                {/* <View style={{flexDirection:'row'}}>
                                                                    <Text>Quantity: </Text>
                                                                    <TextInput
                                                                        style={{width: 40,
                                                                            height: 40,
                                                                            alignSelf: 'center',
                                                                            backgroundColor: '#ccc',
                                                                            borderRadius: 5,
                                                                            paddingHorizontal: 16,
                                                                            fontSize: 10,
                                                                            color: '#ffffff',
                                                                            marginVertical: 10
                                                                        }}
                                                                        placeholder=''
                                                                        underlineColorAndroid='rgba(0,0,0,0)'
                                                                        placeholderTextColor="black"
                                                                        onChangeText = {qty => this.setState({qty})}
                                                                        autoCapitalize = "none"
                                                                        autoCorrect = {false}
                                                                    />
                                                                </View> */}
                                                            <Text style={styles.itemPrice}>₱{item.unit_price} / {item.unit_measure}</Text>
                                                            <Text style={{position:'absolute', right: 5,top: 110, fontWeight: 'bold'}}>Amount: ₱{item.unit_price*item.quantity}</Text>
                                                        </View>
                                                    </View>
                                            </Swipeout>
                                        </View>
                                        }
                                        refreshing = {this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />
                            </View>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.footContainer}>
                            <View style={{backgroundColor: 'orange', width:'100%',borderRadius:10}}>
                                <TouchableOpacity onPress={this.buyNow}>
                                    <Text style={{fontWeight: '300', fontSize: 20,alignSelf: 'center'}}>Buy Now</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cartContainer: {
        flex: 1,
        borderRadius:5 ,
        alignSelf: 'center',
        flexDirection: 'row',
        width: '98%',
        height: 130,
        backgroundColor:'white'
    },
    imageContainer: {
        width: 100,
        height: 100,
        flex: 1,
        paddingTop: 10,
        paddingLeft: 10,
        paddingBottom: 10
    },
    image: {
        height: 80,
        width: 80,
        padding: 10,
    },
    contentContainer: {
        width: 30,
        height: 11,
        flex: 1
    },
    itemName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 18,
        fontWeight: '300'
    },
    footer: {
        position: 'absolute',
        left: 0,
        right:0,
        bottom: 0
    },
    footContainer: {
        width: Window.Width,
        height: 40,
        flex: 1,
        flexDirection: 'row'
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
    Cart: Cart,
    Checkout: checkout
}
);

const AppContainer = createAppContainer(AppStackContainer);