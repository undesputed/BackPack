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
    RefreshControl,
    ImageBackground,
    TextInput
} from 'react-native';
import { AsyncStorage } from '@react-native-community/async-storage';
import Category from '../component/Category';
import Item from '../component/item';
import { SearchBar, Divider } from 'react-native-elements';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Categ from './category';
import onCategory from './onCategory';
import perItem from './Item';
import newArrival from './newArrivals';
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

    goToNewArrival = () => {
        this.props.navigation.push('newArrival');
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
            <ImageBackground source={require('../images/bg.png')} style={{width: '100%', height: '100%'}}>

                <SafeAreaView style={{flex:1}}>
                    <View style={{flex:1}}>
                        <View style={{ height: 58,
                            borderBottomWidth:1,
                            borderBottomColor:'#dddddd',
                            flexDirection: 'row'}}>
                            {/* <SearchBar
                                placeholder="Type Here..."
                                onChangeText={this.updateSearch}
                                value={search}
                            /> */}
                            <TextInput
                                style={{
                                    width: '80%',
                                    height: 60,
                                    backgroundColor: '#dddddd',
                                    alignSelf: 'center',
                                    borderRadius: 5
                                }}
                                placeholder='Search'
                            />
                            <Button
                                title='Search'
                                color='skyblue'
                                style={{height: 30,padding: 10,borderRadius: 5}}
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
                        <View style={{ flex: 1, paddingTop: 20}}>
                            <TouchableOpacity onPress={this.goToCategory}>
                                <Text style={{fontSize:24, fontWeight: '700',color: 'white', paddingHorizontal: 20}}>
                                    Categories 
                                </Text>
                                <View style={{alignSelf: 'center',height:1,width: '90%',backgroundColor:'white'}}/>
                            </TouchableOpacity>
                            <View style={{ height: 130, marginTop: 20,shadowColor: 'black',
                shadowOffset: {width: 10, height:10},
                shadowRadius: 10}}>
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
                                                        imageUri={{uri:item.image}}
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
                                marginTop: 20, 
                                paddingHorizontal: 20
                            }}>
                                <Text style={{fontSize: 24,
                                    fontWeight: '700',color:'white'
                                }}>
                                    BakPak Welcomes You
                                </Text>
                                <View style={{height: 1, width:'99%' ,alignSelf: 'center', backgroundColor: 'white'}}/>
                                <Text style={{fontWeight: '100', marginTop: 5,color:'white',paddingTop:0}}>
                                    Your Backup to Your School Pack
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
                            <View style={{ flex: 1, paddingTop: 20}}>
                                <TouchableOpacity onPress={this.goToNewArrival}>
                                    <Text style={{fontSize:24, fontWeight: '700', paddingHorizontal: 20,color:'white'}}>
                                        New Arrivals 
                                    </Text>
                                    <View style={{alignSelf: 'center',height:1,width: '90%',backgroundColor:'white'}}/>
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
                            <View style={{ flex: 1, paddingTop: 20}}>
                                <Text style={{fontSize:24, fontWeight: '700', paddingHorizontal: 20, color:'white'}}>
                                    Promos 
                                </Text>
                                <View style={{alignSelf: 'center',height:1,width: '90%',backgroundColor:'white'}}/>
                                <View style={{ height: 130, marginTop: 20, marginBottom: 20}}>
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
            </ImageBackground>
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
        perItem: perItem,
        newArrival: newArrival
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