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
        TextInput,
        Modal
    } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Swipeout from 'react-native-swipeout';
import Icons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const Window = {
    Width:Dimensions.get("window").width,
    Height:Dimensions.get("window").height
}

export default class OrderItem extends Component {
    
    _isMounted = false;

    static navigationOptions =({navigation, screenProps}) => ({
        title: navigation.state.params.orderCode
      });

    componentWillMount() {
        this.startHeadHeight = 80
        if(Platform.OS == 'android'){
            this.startHeadHeight = 100 + StatusBar.currentHeight
        }
    }

    constructor(props){
        super(props);
        this.state = {
            items: [],
            refreshing: false,
            user: [],
            date: [],
            setDate: '',
            search: '',
            showModal: false,
            itemId: 0
        };
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
        this._isMounted=true;
        this.fetchItems();
        this.fetchUser();
        this.fetchDate();
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    _onRefresh = () =>{
        this.setState({refreshing: true});
        this.fetchItems().then(()=>{
            this.setState({refreshing: false})
        });
        this.fetchUser().then(()=>{
            this.setState({refreshing:false});
        });
        this.fetchDate().then(()=>{
            this.setState({refreshing:false});
        })
    }

    ItemSepartor = () =>{
        return (
            <View
                style={{height: 10,
                width: "100%"}}
            />
        );
    }

    reportItem(item_id){
        this.setState({showModal:true,itemId:item_id});
    }

    Damage = async() => {
        const {navigation} = this.props;
        const order_code = navigation.getParam('orderCode','N/A');
        const user_id = await AsyncStorage.getItem('user_id');
        const item_id = this.state.itemId;
        const issue = 'DAMAGED';
        var sql = 'http://192.168.43.35:8080/reportOrder/'+issue+'/'+user_id+'/'+item_id+'/'+order_code;
        axios.post(sql).then(function(response){
            console.log(response);
        }).then(function(error){
            console.log(error);
        });
        alert('We Will contact you ASAP');
        this.setState({showModal:false});
    }

    notReceived = async() => {
        const {navigation} = this.props;
        const order_code = navigation.getParam('orderCode','N/A');
        const user_id = await AsyncStorage.getItem('user_id');
        const item_id = this.state.itemId;
        const issue = 'NOT RECEIVED';
        var sql = 'http://192.168.43.35:8080/reportOrder/'+issue+'/'+user_id+'/'+item_id+'/'+order_code;
        axios.post(sql).then(function(response){
            console.log(response);
        }).then(function(error){
            console.log(error);
        });
        alert('We Will contact you ASAP');
        this.setState({showModal:false});
    }

    render() {
        return(
                <SafeAreaView style={{flex:1}}>
                    <Modal
                        visible={this.state.showModal}
                        onRequestClose={() => this.setState({showModal:false})}
                    >
                        <View style={{flex: 1, backgroundColor: '#ccc'}}>
                            <ScrollView
                                refreshControl={
                                    <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this._onRefresh}
                                    />
                                }
                            >   
                                <Text style={{fontSize:30, fontWeight: '700'}}>Report Item</Text>
                                <TouchableOpacity onPress={this.Damage}>
                                    <View style={{flex:1,alignSelf:'center'}}>
                                        <View style={{backgroundColor: 'white',borderRadius: 5, width: 350}}>
                                            <Text style={{fontSize: 15, textAlign: 'center', padding: 12, fontWeight: 'bold'}}>Item Damaged</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={{height:1,backgroundColor:'#ccc',width:'100%'}}/>
                                <TouchableOpacity onPress={this.notReceived}>
                                    <View style={{flex:1,alignSelf:'center'}}>
                                        <View style={{backgroundColor: 'white',borderRadius: 5, width: 350}}>
                                            <Text style={{fontSize: 15, textAlign: 'center', padding: 12, fontWeight: 'bold'}}>Not Received</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </Modal>
                    <View style={{flex:1}}>
                        <View style={{ flex: 1,  paddingTop: 10}}>
                                <View style={{alignSelf: 'center',height:1,width: '90%',backgroundColor:'white'}}/>
                            <View style={{ height: 130, marginTop: 20, flex:1}}>
                                    <FlatList
                                        data={this.state.items}
                                        ItemSeparatorComponent={this.ItemSepartor}
                                        keyExtractor={(item,index) => index.toString()}
                                        renderItem={({item}) =>
                                        <View style={styles.contianer}>
                                            <Swipeout right={[
                                                    {
                                                    text: 'Report',
                                                    backgroundColor: 'tomato',    
                                                    underlayColor: 'rgba(255, 0, 0, 1, 0.6)',
                                                    onPress: () => this.reportItem(item.item_id)
                                                    }
                                                ]}
                                                autoClose={true}
                                                backgroundColor= 'transparent'>
                                                    <View style={{flex: 1, width: Window.width, flexDirection: 'row'}}>
                                                        <View style={{padding:10}}>
                                                            <Image
                                                                style={{width:100,height:100,resizeMode:'stretch'}}
                                                                source={{uri:item.item_image}}
                                                            />
                                                        </View>
                                                        <View style={{paddingTop:10, flex:1}}>
                                                            <Text style={{fontWeight: 'bold'}}>{item.item_name}</Text>
                                                            <Text style={{fontWeight: 'bold'}}>Brand: {item.item_brand}</Text>
                                                            <Text>₱ {item.unit_price}</Text>
                                                            <Text style={{position: 'absolute', right: 20, bottom: 10}}>x{item.order_quantity}</Text>
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
