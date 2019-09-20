import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TextInput,
    ScrollView,
    TourchableOpacity,
    Dimensions,
    WebView,
    Modal,
    RefreshControl,
    FlatList
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Swipeout from 'react-native-swipeout';
import axios from 'axios';

const Window = {
    Width: Dimensions.get('window').width,
    Height: Dimensions.get('window').height
}

export default class History extends Component{
    static navigationOptions = {
        title: 'History'
    }

    constructor(props){
        super(props);
        this.state = {
            histDel: [],
            histUser: [],
            histItem: [],
            refreshing: false
        }
    }

    fetchHistory = async() => {
        const id = await AsyncStorage.getItem('user_id');
        const response = await fetch('http://192.168.43.35:8080/getHistory/'+id);
        const history = await response.json();
        this.setState({histItem:history});
    }

    componentDidMount(){
        this.fetchHistory();
    }

    deleteHitory(id){
        var url = 'http://192.168.43.35:8080/delHistory/'+id;
        axios.post(url).then(function(response){
            console.log(response);
        }).then(function(error){
            console.log(error);
        });
        alert('History Deleted');
    }

    _onRefresh(){
        this.setState({refreshing: true})
        this.fetchHistory().then(() => {
            this.setState({refreshing: false})
        })
    }

    ItemSepartor = () =>{
        return (
            <View
                style={{height: 3,
                width: "100%",
            backgroundColor: "#ccc"}}
            />
        );
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={{height: 2, width:Window.width}}/>
                    <View style={styles.contentContainer}>
                        <FlatList
                            data = {this.state.histItem}
                            ItemSeparatorComponent={this.ItemSepartor}
                            keyExtractor={(item,index) => index.toString()}
                            renderItem={({item}) =>
                            <View style={styles.content}>
                                <Swipeout right={[
                                            {
                                            text: 'Delete',
                                            backgroundColor: '#ccc',    
                                            underlayColor: 'rgba(255, 0, 0, 1, 0.6)',
                                            onPress: () => this.deleteHitory(item.order_code)
                                            }
                                        ]}
                                        autoClose={true}
                                        backgroundColor= 'transparent'>
                                    <View style={{padding:10}}>
                                        <Text style={{fontSize:20,fontWeight:'bold'}}>{item.order_code}</Text>
                                    </View>
                                    <View style={{paddingTop:10, flex:1}}>
                                        <Text style={{position: 'absolute', right: 20, bottom: 10}}>{item.delivery_status}</Text>
                                    </View>
                                </Swipeout>
                            </View>
                            }
                            refreshing = {this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    </View>
                    <View style={{height: 2, width:Window.width}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#ccc'
    },
    contentContainer:{
        flex: 1,
        flexDirection:'row',
        backgroundColor: 'white'
    },
    content: {
        elevation: 3,
        width: Window.Width - 10,
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 3,
        height: 100
    }
});