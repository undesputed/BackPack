import React, {Component} from 'react';
import {Platform, 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    StatusBar, 
    ScrollView, 
    Button, 
    Dimensions, 
    FlatList, 
    RefreshControl,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import myOrders from './myOrder';
import reports from './orderItem';

const Window = {
    Width:Dimensions.get("window").width,
    Height:Dimensions.get("window").height
}

export class Order extends Component {

    static navigationOptions ={
        header: null
    }

    constructor(props){
        super(props);
        this.state={
            ordersCode: [],
            getItems: [],
            refreshing:false
        }
    }

    fetchOrderCode = async() => {
        const user_id = await AsyncStorage.getItem('user_id');
        const response = await fetch('http://192.168.43.35:8080/getOrderCode/'+user_id);
        const order_code = await response.json();
        this.setState({ordersCode:order_code});
    }

    fetchItems = async() => {
        const id = await AsyncStorage.getItem('user_id');
        const res = await fetch('http://192.168.43.35:8080/getOrderItems/'+id);
        const item = await res.json();
        this.setState({getItems:item});
    }

    ItemSepartor = () =>{
        return (
            <View
                style={{height: 5,
                width: "100%",}}
            />
        );
    }


    componentDidMount(){
        this.fetchOrderCode();
        this.fetchItems();
    }

    _onRefresh = () =>{
        this.setState({refreshing:true});
        this.fetchItems().then(()=>{
            this.setState({refreshing:false})
        });
        this.fetchOrderCode().then(() => {
            this.setState({refreshing:false})
        });
    }

    showOrder(orderCode,status,payment) {
        if(status == 'RECEIVED'){
            this.props.navigation.navigate('orderItem',{orderCode,status,payment});
        }else{
            this.props.navigation.navigate('myOrder',{orderCode,status,payment});
        }
    }


    render() {
        return(
            <ImageBackground source={require('../images/bg.png')} style={{width: '100%', height: '100%'}}>
            <View style={styles.container}>
                    <View style={styles.topNav}>
                        <Text style={{fontSize: 20, fontWeight: '700', padding: 10}}>Orders</Text>
                    </View>
                    <View style={{height: 10, width:Window.width}}/>
                    <View style={{flex: 1,flexDirection: 'row', alignContent: 'center', alignItems: 'center', alignSelf: 'center'}}>
                        <Text style={{color: 'white', position: 'absolute', right: 50, fontWeight: 'bold'}}>ORDER CODE</Text>
                        <Text style={{color: 'white', position: 'absolute', left: 85, fontWeight: 'bold'}}>STATUS</Text>
                    </View>
                    <FlatList
                        data = {this.state.ordersCode}
                        ItemSeparatorComponent={this.ItemSepartor}
                        keyExtractor={(item,index) => index.toString()}
                        renderItem={({item}) => 
                            <View style={{flex: 1,}}>   
                                <View style={styles.cardContainer}>
                                    <TouchableOpacity onPress={() => this.showOrder(item.order_code.toString(),item.status,item.payment)}>
                                        <View style={{padding:10}}>
                                            <Text style={{fontSize:20,fontWeight:'bold'}}>{item.order_code}</Text>
                                        </View>
                                        <View style={{paddingTop:10, flex:1}}>
                                            <Text style={{position: 'absolute', right: 20, bottom: 10}}>{item.status}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                    {/* <ScrollView refreshControl={
                        <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                      />
                    }>
                    <View style={{height: 10, width:Window.width}}/>
                        <View style={{flex: 1,}}> */}
                        {/* {
                            this.state.ordersCode.map((item,i) => {
                                return( */}
                                    {/* <View style={styles.cardContainer}> */}
                                        {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('myOrder',{orderCode:item.order_code.toString()})}> */}
                                        {/* <TouchableOpacity onPress={() => this.showOrder(item.order_code.toString(),item.status,item.payment)}>
                                            <View style={{padding:10}}>
                                                <Text style={{fontSize:20,fontWeight:'bold'}}>{item.order_code}</Text>
                                            </View>
                                            <View style={{paddingTop:10, flex:1}}>
                                                <Text style={{position: 'absolute', right: 20, bottom: 10}}>{item.status}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View> */}
                                {/* );
                            })
                        } */}
                    {/* </View>
                    <View style={{height: 10, width:Window.width}}/>
                    </ScrollView> */}
            </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topNav:{
        backgroundColor: 'white',
        alignSelf: 'center',
        height: 50,
        fontSize: 20,
        width: '100%',
        paddingBottom: 10
    },
    cardContainer:{
        elevation: 3,
        width: Window.Width - 10,
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 3,
        height: 100
    }
});


export default class App extends Component{
    render(){
        return(
            <AppContainer/>
        );
    }
}


const AppStackContainer = createStackNavigator({
    Order: Order,
    myOrder: myOrders,
    orderItem: reports
}
);

const AppContainer = createAppContainer(AppStackContainer);