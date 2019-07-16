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
        AsyncStorage
    } from 'react-native';
import { SearchBar } from 'react-native-elements';

export default class Cart extends Component {
    
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
            data: []
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

    render() {
        const { search } = this.state;
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
                                    keyExtractor={(item,index) => index.toString()}
                                    renderItem={({item}) =>
                                    <View style={{flex:1,flexDirection:'row',padding:10}}>
                                        <TouchableOpacity>
                                            <Image
                                                style={{width:100,height:100,paddingLeft:10}}
                                                source={{uri:item.item_image}}
                                            />
                                            <View style={{paddingLeft: 10}}>
                                                <Text style={{fontSize: 20, fontWeight:'500'}}>
                                                    {item.item_name}
                                                </Text>
                                                <Text>
                                                    {item.item_description}
                                                </Text>
                                                <Text>
                                                    {item.unit_price} / {item.unit_measure}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    }
                                />
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
