
import React, {Component} from 'react';
import {
    Platform, 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    StatusBar, 
    ScrollView,
    TouchableOpacity,
    ListView,
    ActivityIndicator,
    SafeAreaView,
    Dimensions,
    FlatList,
    AsyncStorage,
    TextInput
} from 'react-native';
import Button from 'apsl-react-native-button';
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationActions, StackActions } from 'react-navigation';
import NumericInput from 'react-native-numeric-input';
import axios from 'axios';

const Window = {
    Width:Dimensions.get("window").width,
    Height:Dimensions.get("window").height
}

export default class App extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        title: 'Product',
    });

    ItemSepartor = () =>{
        return (
            <View
                style={{height: .5,
                width: "100%",
            backgroundColor: "#111a0b"}}
            />
        );
    }

    constructor(props){
        super(props);
        this.state={
            data: [],
            itemId: '',
            value: 1,
            res:[],
            cart: [],
            comment:[
                {id:1, image: "https://bootdey.com/img/Content/avatar/avatar1.png", name:"Frank Odalthh",    comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
                {id:2, image: "https://bootdey.com/img/Content/avatar/avatar6.png", name:"John DoeLink",     comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
                {id:3, image: "https://bootdey.com/img/Content/avatar/avatar7.png", name:"March SoulLaComa", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
                {id:4, image: "https://bootdey.com/img/Content/avatar/avatar2.png", name:"Finn DoRemiFaso",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
                {id:5, image: "https://bootdey.com/img/Content/avatar/avatar3.png", name:"Maria More More",  comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
                {id:6, image: "https://bootdey.com/img/Content/avatar/avatar4.png", name:"Clark June Boom!", comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
                {id:7, image: "https://bootdey.com/img/Content/avatar/avatar5.png", name:"The googler",      comment:"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."},
            ]
        }
    }
    
    fetchItem = async() => {
        const {navigation} = this.props;
        const id = navigation.getParam('id','N/A');
        const itemId = JSON.stringify(id);
        const response = await fetch('http://192.168.43.35:8080/byItem/'+itemId);
        const item = await response.json();
        this.setState({data:item});
    }

    insertCart = async() => {
        const {navigation} = this.props;
        const id = navigation.getParam('id','N/A');
        const itemId = JSON.stringify(id);
        const qty = this.state.value;
        const userId = await AsyncStorage.getItem('user_id');
        const inCart = await fetch('192.168.43.35:8080/inCart/'+userId+'/'+qty+'/'+itemId);
        const response = await inCart.json();
        this.setState({res:response});
    }

    componentDidMount(){
        this.fetchItem();
    }

    addingCart = async()=> {
        const {navigation} = this.props;
        const id = navigation.getParam('id','N/A');
        const itemId = JSON.stringify(id);
        const userId = await AsyncStorage.getItem('user_id');
        const qty = this.state.value;
        var url = 'http://192.168.43.35:8080/insertCart';
        axios.post(url,{
            userId: userId,
            qty: qty,
            itemId: itemId
        }).then(function (response){
            console.log(response);
        }).catch(function (error){
            console.log(error);
        });
        alert('Added to Cart');
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'HomePage' })]
        }))
    }

    render() {
        return (
        <View style={styles.container}>
            {
                this.state.data.map((item,i) => {
                    return(
                        <View style={{flex:1}}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.prodContainer}>
                                <Image source={{uri:item.item_image}} style={styles.prodImage}/>
                                <Text style={styles.prodCat}>{item.sub_category_name}</Text>
                                <Text style={styles.prodName}>{item.item_name}</Text>
                                <Text style={styles.prodPrice}>₱{item.unit_price}</Text>
                                <View style={styles.descContainer}>
                                    <Text style={styles.desc}>Description:</Text>
                                    <NumericInput
                                        style={{alignItems: 'baseline'}} 
                                        value={this.state.value} 
                                        onChange={value => this.setState({value})} 
                                        onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                                        totalWidth={100} 
                                        totalHeight={35} 
                                        iconSize={25}
                                        step={1}
                                        valueType='real'
                                        rounded 
                                        textColor='#B0228C' 
                                        iconStyle={{ color: 'white' }} 
                                        rightButtonBackgroundColor='#111a0b'
                                        leftButtonBackgroundColor='#111a0b'/>
                                </View>
                                    <Text style={styles.descContent}>{item.item_description}</Text>
                            </View>
                            <FlatList
                                style={styles.root}
                                data={this.state.data}
                                extraData={this.state}
                                ItemSeparatorComponent={() => {
                                return (
                                    <View style={styles.separator}/>
                                )
                                }}
                                keyExtractor={(item)=>{
                                return item.id;
                                }}
                                renderItem={(item) => {
                                const Notification = item.item;
                                return(
                                    <View style={styles.commentContainer}>
                                    <TouchableOpacity onPress={() => {}}>
                                        <Image style={styles.image} source={{uri: Notification.image}}/>
                                    </TouchableOpacity>
                                    <View style={styles.content}>
                                        <View style={styles.contentHeader}>
                                        <Text  style={styles.name}>{Notification.name}</Text>
                                        <Text style={styles.time}>
                                            9:58 am
                                        </Text>
                                        </View>
                                        <Text rkType='primary3 mediumLine'>{Notification.comment}</Text>
                                    </View>
                                    </View>
                                );
                                }}/>
                        </ScrollView>
                            <View style={styles.footer}>
                                <Button style={styles.buttonStyle8}
                                        textStyle={styles.textStyle8}
                                        onPress={this.addingCart}
                                        >
                                    <View style={styles.customViewStyle}>
                                        <Text style={{fontFamily: 'Avenir', color:'white'}}>
                                        Add to Cart <Icon name="shopping-cart" size={15} />
                                        </Text>
                                    </View>
                                </Button>
                            </View>
                        </View>
                    );
                })
            }
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    prodContainer: {
        flex:1,
        backgroundColor: '#f3f3f3',
    },
    prodImage: {
        width:Window.Width,
        height: 300,
        borderRadius: 5,
        resizeMode: 'stretch'
    },
    prodCat: {
        paddingTop: 5,
        paddingBottom:5,
        fontSize: 15,
        fontWeight: '200',
        alignSelf: 'center'
    },
    prodName: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    prodPrice: {
        padding: 5,
        fontSize: 15,
        fontWeight: '500',
        alignSelf: 'center'
    },
    descContainer: {
        height: 40,
        flex: 1,
        width: Window.Width,
        backgroundColor: '#ccc',
        flexDirection: 'row'
    },
    desc: {
        paddingTop: 5,
        alignSelf: 'baseline',
        fontSize: 20,
        fontWeight: '300',
        paddingLeft: 5,
        paddingHorizontal: 140
    },
    descContent: {
        paddingLeft: 30,
        height: 100
    },
    buttonStyle8: {
        backgroundColor: '#1c313a',
        borderColor: '#333',
        borderWidth: 2,
        borderRadius: 5,
    },
    textStyle8: {
        width: 200,
        fontFamily: 'Avenir Next',
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    },
    customViewStyle: {
        width: 120,
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 30,
        flexDirection: 'row',
    },
    footer: {
        position: 'absolute',
        left: 0,
        right:0,
        bottom: 0
    },
    itemId: {
        opacity: 0,
        height: .5
    },
    root: {
        backgroundColor: "#ffffff",
        marginTop:10,
    },
    commentContainer: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    content: {
        marginLeft: 16,
        flex: 1,
    },
    contentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6
    },
    separator: {
        height: 1,
        backgroundColor: "#CCCCCC"
    },
    image:{
        width:45,
        height:45,
        borderRadius:20,
        marginLeft:20
    },
    time:{
        fontSize:11,
        color:"#808080",
    },
    name:{
        fontSize:16,
        fontWeight:"bold",
    },
});
