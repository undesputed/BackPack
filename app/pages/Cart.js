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
        AsyncStorage,
        RefreshControl,
        Dimensions
    } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Checkbox } from 'react-native-paper';
import NumericInput from 'react-native-numeric-input';
import axios from 'axios';
import Swipeout from 'react-native-swipeout';
import Icon from "react-native-vector-icons/MaterialIcons";
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import MyOrder from './myOrder';

const Window = {
    Width:Dimensions.get("window").width,
    Height:Dimensions.get("window").height
}

export class Cart extends Component {
    
    static navigtionOptions = {
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
            activeRowKey: null
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

    componentDidMount(){
        this.fetchCart();
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
                width: "100%",
            backgroundColor: "#ccc"}}
            />
        );
    }

    __onChecked = () =>{
        this.setState({checked: false});
    }

    goToOrder = () => {
        alert('Go to Order');
        this.props.navigation.navigate('myOrder');
    }

    render() {
        const { search } = this.state;
        const { checked } = this.state
        let swipeBtns = [{
            autoClose: true,
            text: 'Delete',
            backgroundColor: '#FF00FF',
            underlayColor: 'rgba(255, 0, 0, 1, 0.6)',
            onPress: () => { this.deleteNote(rowData) }
          }];
        return(
                <SafeAreaView style={{flex:1}}>
                    <View style={{flex:1}}>
                        <View style={{ height: 80, backgroundColor: 'white',
                                        borderBottomWidth:1,
                                        borderBottomColor:'#dddddd'}}>
                            <SearchBar
                                placeholder="Type Here..."
                                onChangeText={this.updateSearch}
                                value={search}
                            />
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 10}}>
                            <Text style={{fontSize:24, fontWeight: '700', paddingHorizontal: 20}}>
                                Cart 
                            </Text>
                            <View style={{ height: 130, marginTop: 20, flex:1}}>
                                    <FlatList
                                        data={this.state.data}
                                        ItemSeparatorComponent={this.ItemSepartor}
                                        keyExtractor={(item,index) => index.toString()}
                                        renderItem={({item}) =>
                                        <View style={styles.contianer}>
                                            <Swipeout right={swipeBtns}
                                                autoClose='true'
                                                backgroundColor= 'transparent'>
                                                <TouchableOpacity>
                                                    <View style={styles.cartContainer}>
                                                        <Checkbox
                                                            status={this.state.checked}
                                                            onPress={() => { this.setState({ checked: checked }); }}
                                                        />
                                                        <View style={styles.imageContainer}>
                                                            <Image
                                                                style={styles.image}
                                                                source={{uri:item.item_image}}
                                                            />
                                                        </View>
                                                        <View style={styles.contentContainer}>
                                                            <Text style={styles.itemName}>{item.item_name}</Text>
                                                            <NumericInput
                                                                style={{alignItems: 'baseline'}} 
                                                                value={this.state.value} 
                                                                onChange={value => this.setState({value})} 
                                                                onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                                                                totalWidth={60} 
                                                                totalHeight={35} 
                                                                iconSize={25}
                                                                step={1}
                                                                valueType='real'
                                                                rounded 
                                                                textColor='#B0228C' 
                                                                iconStyle={{ color: 'white' }} 
                                                                rightButtonBackgroundColor='#111a0b'
                                                                leftButtonBackgroundColor='#111a0b'/>
                                                            <Text style={styles.itemPrice}>₱{item.unit_price} / {item.unit_measure}</Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            </Swipeout>
                                        </View>

                                        // <View style={{flex:1,flexDirection:'row',padding:10}}>
                                        //     <TouchableOpacity>
                                        //         <Image
                                        //             style={{width:100,height:100,paddingLeft:10}}
                                        //             source={{uri:item.item_image}}
                                        //         />
                                        //         <View style={{paddingLeft: 10}}>
                                        //             <Text style={{fontSize: 20, fontWeight:'500'}}>
                                        //                 {item.item_name}
                                        //             </Text>
                                        //             <Text>
                                        //                 {item.item_description}
                                        //             </Text>
                                        //             <Text>
                                        //                 {item.unit_price} / {item.unit_measure}
                                        //             </Text>
                                        //         </View>
                                        //     </TouchableOpacity>
                                        // </View>
                                        }
                                        refreshing = {this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />
                            </View>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.footContainer}>
                            <View style={{backgroundColor: 'white',width:100,color: 'black' }}>
                                <Checkbox
                                    status={this.state.checked}
                                    onPress={() => { this.setState({ checked: checked }); }}
                                />
                                <Text style={{fontWeight: '300', color: 'black'}}>Select All</Text>
                            </View>
                            <View style={{backgroundColor: '#FF00FF', width:100}}>
                                <Text style={{fontWeight: '300', fontSize: 20,alignSelf: 'center'}}>Buy Now</Text>
                            </View>
                        </View>
                        {/* <Button style={styles.buttonStyle8}
                                textStyle={styles.textStyle8}
                                >
                            <View style={styles.customViewStyle}>
                                <Text style={{fontFamily: 'Avenir', color:'white'}}>
                                Add to Cart <Icon name="shopping-cart" size={15} />
                                </Text>
                            </View>
                        </Button> */}
                    </View>
                </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cartContainer: {
        flex: 1,
        flexDirection: 'row',
        width: Window.Width,
        height: 100,
        backgroundColor:'white'
    },
    imageContainer: {
        width: 100,
        height: 100,
        flex: 1
    },
    image: {
        height: 80,
        width: 80,
        resizeMode:'stretch'
    },
    contentContainer: {
        width: 20,
        height: 11,
        flex: 1
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 14,
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
    MyOrder: MyOrder
}
);

const AppContainer = createAppContainer(AppStackContainer);