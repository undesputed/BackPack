import React, {Component} from 'react';
import {
    Platform, 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    StatusBar, 
    ScrollView, 
    Button,
    TouchableOpacity,
    ListView,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
    FlatList,
    RefreshControl
} from 'react-native';
import { AsyncStorage } from '@react-native-community/async-storage';
import Category from '../component/Category';
import Item from '../component/item';
import { SearchBar, Divider } from 'react-native-elements';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Categ from './category';
import onCategory from './onCategory';
import perItem from './Item';
// import { FlatList } from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');
export class HomePage extends Component {
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
            Item: [],
            refreshing: false
        };
    }

    // getDate = () =>{
    //     var day = new Date().getDate();
    //     var month = new Date().getMonth() + 1;
    //     var year = new Date().getFullYear();
    //     var date = year+ '-' + month + '-' + day;
    //     alert(date);
    // }

    fetchCategory = async()=>{
        const response = await fetch('http://192.168.43.35:8080/category');
        const category = await response.json();
        this.setState({data:category});
    }

    fetchItem = async()=>{
        var day = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var date = year+ '-' + month + '-' + day;
        const response = await fetch('http://192.168.43.35:8080/item/'+date);
        const item = await response.json();
        this.setState({Item:item})
    }

    componentDidMount(){
        this.fetchCategory();
        this.fetchItem();
    }

    updateSearch = search => {
    this.setState({ search });
    };
    
    goToCategory = () => {
        this.props.navigation.push('Categ');
    }

    _onRefresh =() =>{
        this.setState({refreshing: true});
        this.fetchItem().then(()=>{
            this.setState({refreshing: false})
        });
        this.fetchCategory().then(()=>{
            this.setState({refreshing: false})
        });
    }

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
                <ScrollView
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                      }
                    scrollEventThrottle={16}>
                    <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20}}>
                        <TouchableOpacity onPress={this.goToCategory}>
                            <Text style={{fontSize:24, fontWeight: '700', paddingHorizontal: 20}}>
                                Categories 
                            </Text>
                        </TouchableOpacity>
                        <View style={{ height: 130, marginTop: 20}}>
                            {/* <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                
                            > */}
                                <FlatList
                                    data={this.state.data}
                                    keyExtractor={(item,index) => index.toString()}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({item}) =>
                                        <View>
                                            <TouchableOpacity onPress={ () => this.props.navigation.push('onCategory',{id:item.id,name:item.sub_category_name})}>
                                                <Category
                                                    imageUri={require('../images/bakpaklogo.png')}
                                                    name={item.sub_category_name}
                                                />
                                            </TouchableOpacity>
                                        </View>         
                                    }    
                                />
                                {/* <Category 
                                    imageUri={require('../images/category/paper.png')}
                                    name= 'Papers'
                                />
                                <Category 
                                    imageUri={require('../images/category/writingtools.png')}
                                    name = 'Writing Tools'
                                />
                                <Category 
                                    imageUri={require('../images/category/notebook.png')}
                                    name = 'Notebook'
                                /> */}
                            {/* </ScrollView> */}
                        </View>
                        <View style={{
                            marginTop: 40, 
                            paddingHorizontal: 20
                        }}>
                            <Text style={{fontSize: 24,
                                fontWeight: '700'
                            }}>
                                BakPak Welcomes You
                            </Text>
                            <Text style={{fontWeight: '100', marginTop: 5}}>
                                Your BackPack to Your School Pack
                            </Text>
                            <View style={{width: width - 40, height: 200, marginTop: 20}}>
                                <Image
                                    style={{flex:1,
                                        height: null,
                                        width: null,
                                        resizeMode: 'cover',
                                        borderRadius:5,
                                        borderWidth: 1,
                                        borderColor: '#dddddd'        
                                    }}
                                    source={require('../images/background.png')}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20}}>
                            <TouchableOpacity>
                                <Text style={{fontSize:24, fontWeight: '700', paddingHorizontal: 20}}>
                                    New Arrival 
                                </Text>
                            </TouchableOpacity>
                                <View style={{ height: 150, marginTop: 20}}>
                                    <FlatList
                                        data={this.state.Item}
                                        keyExtractor={(item,index) => index.toString()}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        renderItem={({item}) =>
                                            <View>
                                                <TouchableOpacity onPress={() => this.props.navigation.push('perItem',{id:item.item_id})}>
                                                    <Item
                                                        imageUri={{uri:item.item_image}}
                                                        name={item.item_name}
                                                        price={item.unit_price}
                                                        unit_measure={item.unit_measure}
                                                        desc={item.item_description}
                                                    />
                                                </TouchableOpacity>
                                            </View>         
                                        }    
                                    />
                            </View>
                        </View>
                        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20}}>
                            <Text style={{fontSize:24, fontWeight: '700', paddingHorizontal: 20}}>
                                Pomo 
                            </Text>
                            <View style={{ height: 130, marginTop: 20}}>
                                <ScrollView
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    <Category 
                                        imageUri={require('../images/bakpaklogo.png')}
                                        name = 'Papers'
                                    />
                                    <Category 
                                        imageUri={require('../images/bakpaklogo.png')}
                                        name = 'Papers'
                                    />
                                    <Category 
                                        imageUri={require('../images/bakpaklogo.png')}
                                        name = 'Papers'
                                    />
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                    
                </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}

export default class App extends Component{
    render(){
        return(
            <AppContainer/>
        );
    }
}

const AppStackContainer = createStackNavigator({
        HomePage : HomePage,
        Categ : Categ,
        onCategory : onCategory,
        perItem: perItem
    }
);

AppStackContainer.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true;
    if(navigation.state.index < 0){
        tabBarVisible = false;
    }

    return {
        tabBarVisible,
    };
};

const AppContainer = createAppContainer(AppStackContainer);