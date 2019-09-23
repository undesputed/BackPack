import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View, 
        Image, 
        StatusBar, 
        TextInput, 
        Button,
        Dimensions,
        ScrollView,
        TouchableOpacity,
        RefreshControl
    } from 'react-native';
import AsynStorage from '@react-native-community/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';

const Window = {
    Width: Dimensions.get('window').width,
    Height: Dimensions.get('window').height
}

export default class Shipping extends Component {

    _isMounted = false;

    constructor(props){
        super(props);
        this.state={
            items: [],
            refreshing: false,
            total: '',
            points: [],
            price: ''
        }
    }

    fetchData = async() => {
        const id = await AsynStorage.getItem('user_id');
        const response = await fetch('http://192.168.43.35:8080/userCart/'+id);
        const cart = await response.json();
        this.setState({items:cart});
    }

    fetchPoints = async() => {
        const id = await AsynStorage.getItem('user_id');
        const response = await fetch('http://192.168.43.35:8080/getPoints/'+id);
        const getPoints = await response.json();
        this.setState({points:getPoints});
    }

    componentDidMount(){
        this._isMounted = true;
        this.fetchData();
        this.fetchPoints();
    }

    componentWillUnmount(){
        this._isMounted=false;
    }

    _onRefresh = () =>{
        this.setState({refreshing: true});
        this.fetchData().then(()=>{
            this.setState({refreshing: false})
        });
        this.fetchPoints().then(() => {
            this.setState({refreshing:false})
        });
    }

    userPoint(totalPrice,totalDiscount){
        
    }

    ItemSepartor = () =>{
        return (
            <View
                style={{height: 0.5,
                width: "100%",
            backgroundColor: '#ccc'}}
            />
        );
    }
    render() {
        let totalPrice = 0;
        let totalPoints = 0;
        let discountedPrice = 0.00;
        let totalDiscount = 0.00;
        this.state.points.forEach((item) => {
            totalPoints += item.points;
        });
        totalDiscount = totalPoints / 7;
        this.state.items.forEach((item) => {
            totalPrice += item.quantity * item.unit_price;
            discountedPrice += totalPrice - totalDiscount; 
        });
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                    <View style={{height: 10, width:Window.width}}></View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.yourProd}>Your Product</Text>
                    </View>
                        <View style={{height: 10, width:Window.width}}></View>
                    <View style={styles.itemContainer}>
                        <FlatList
                            data = {this.state.items}
                            ItemSeparatorComponent={this.ItemSepartor}
                            keyExtractor={(item,index) => index.toString()}
                            refreshing = {this.state.refreshing}
                            onRefresh={this._onRefresh}
                            renderItem={({item}) => 
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{width:100,height:100, flex: 1, flexDirection: 'row',elevation: 1}}>
                                        <Image 
                                            style={{
                                                width:80,
                                                height: 80,
                                                resizeMode: 'stretch'
                                            }}
                                            source={{uri:item.item_image}}
                                        />
                                        <View style={{flex:1, paddingLeft: 20,}}>
                                            <Text style={{fontWeight: 'bold', fontSize: 20}}>{item.item_name}</Text>
                                            <Text>qty: {item.quantity}</Text>
                                            <Text>₱{item.unit_price}</Text>
                                        </View>
                                    </View>
                                </View>
                            }
                        />
                    </View>
                    <View style={{height: 115, width:Window.width}}></View>
                </ScrollView>
                <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
                    <View style={styles.totalContainer}>
                        <Text>Total Cost: ₱{totalPrice}</Text>
                    </View>
                    <View style={styles.totalContainer}>
                        <Text>Total Points: {totalPoints}                                   7 Points = ₱1</Text>
                        <Button onPress={() => this.props.navigation.navigate('Payment',{totalPrice: totalPrice-totalDiscount})} style={{position: 'absolute', right: '0'}} title='Use Points'/>
                    </View>
                    <View style={{height: 10, width:Window.width}}></View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Payment',{totalPrice: totalPrice})}>
                        <View style={{flex:1,alignSelf:'center'}}>
                            <View style={{backgroundColor: 'skyblue',borderRadius: 5, width: 350}}>
                                <Text style={{fontSize: 15, textAlign: 'center', padding: 12, fontWeight: 'bold'}}>PROCEED  <Icon name="forward" size={20}/></Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccc'
    },
    subContainer:{
        width: Window.Width,
        padding: 15,
        flex: 2
    },
    yourProd:{
        padding: 10,
        fontSize: 18,
        fontWeight: 'bold'
    },
    titleContainer:{
        elevation: 3,
        paddingBottom: 3,
        alignSelf: 'center',
        width: Window.Width - 10,
        borderRadius: 3,
        backgroundColor: 'white'
    },
    itemContainer: {
        elevation: 3,
        width: Window.Width - 10,
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 3
    },
    totalContainer: {
        elevation: 3,
        width: Window.Width - 10,
        alignSelf: 'center',
        backgroundColor: '#69B1B3',
        padding: 10,
        borderRadius: 3   
    }
});