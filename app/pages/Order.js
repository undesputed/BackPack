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
    TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import myOrders from './myOrder';

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
        this.props.navigation.navigate('myOrder',{orderCode,status,payment})
    }


    render() {
        return(
            <View style={styles.container}>
                    <View style={styles.topNav}>
                        <Text style={{fontSize: 20, fontWeight: '700', padding: 10}}>Orders</Text>
                    </View>
                    <ScrollView refreshControl={
                        <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                      />
                    }>
                    <View style={{height: 10, width:Window.width}}/>
                        <View style={{flex: 1,}}>
                        {
                            this.state.ordersCode.map((item,i) => {
                                return(
                                    <View style={styles.cardContainer}>
                                        {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('myOrder',{orderCode:item.order_code.toString()})}> */}
                                        <TouchableOpacity onPress={() => this.showOrder(item.order_code.toString(),item.status,item.payment)}>
                                            <View style={{padding:10}}>
                                                <Text style={{fontSize:20,fontWeight:'bold'}}>{item.order_code}</Text>
                                            </View>
                                            <View style={{paddingTop:10, flex:1}}>
                                                <Text style={{position: 'absolute', right: 20, bottom: 10}}>{item.status}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        }
                    </View>
                    <View style={{height: 10, width:Window.width}}/>
                    </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ccc',
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
    myOrder: myOrders
}
);

const AppContainer = createAppContainer(AppStackContainer);