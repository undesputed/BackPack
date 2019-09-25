import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image, FlatList, Dimensions, RefreshControl} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ProgressBar from 'react-native-progress';

const resizeComponent = (value,percentage) => {
    return value-(value*(percentage/100));
}

const Window = {
    Height: Dimensions.get("window").height,
    Width: Dimensions.get("window").width
}

const cardContainerSize = { 
    Width:resizeComponent(Window.Width, 50),
    Height: resizeComponent(300, 5)
}

export default class NewArrival extends Component {

    _isMounted = false;

    static navigationOptions = {
        title: 'New Arrivals'
    }

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
        this.state = {
            data: [],
            Item: []
        }
    }

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
        this._isMounted = true;
        this.fetchCategory();
        this.fetchItem();
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    _onRefresh(){
        this.setState({refreshing: true});
        this.fetchCategory().then(()=>{
            this.setState({refreshing: false})
        });
    }

    
    render() {
        return(
            // <View style={styles.container}>
                <FlatList 
                    data={this.state.Item}
                    ItemSeparatorComponent={this.ItemSepartor}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) =>
                        <TouchableOpacity activeOpacity={0.9} onPress={ () => this.props.navigation.push('onCategory',{id:item.id,name:item.sub_category_name})}>
                            <View style={styles.container}>
                                <View style={styles.cardContainer}>
                                    <View style={styles.card}>
                                        <Image
                                            source={{uri:item.item_image}}
                                            indicator={ProgressBar}
                                            indicatorProps={{
                                                size: 80,
                                                borderWidth: 0,
                                                color: 'rgba(150,150,150,1)',
                                                unfilledColor: 'rgba(200,200,200,0.2)'
                                            }}
                                            style={styles.image}
                                            // style={{
                                            //     width: 50,
                                            //     height:50,
                                            //     alignItems: 'center',
                                            //     margin: 5,
                                            //     justifyContent: 'center'
                                            // }}

                                        />
                                        <Text style={{
                                            fontSize: 12,
                                            textAlign: 'center',
                                            margin: 10
                                        }}>{item.item_name}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                    numColumns={2}
                    keyExtractor={(item,index) => index.toString()}
                    RefreshControl={
                        <RefreshControl
                            refreshing = {this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                />
            // </View>
        );
    }
}

class Class extends Component {
    render(){
        return(
            <View style={styles.cardContainer}>
                <View style={styles.card}>

                </View>
            </View>
        );
    } 
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    cardContainer: { 
        height: 300,
        width: cardContainerSize.Width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        height: resizeComponent(250, 5),
        width: resizeComponent(cardContainerSize.Width,5),
        elevation: 3,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5
    },
    image: {
        width: resizeComponent(cardContainerSize.Width, 7),
        height: 151,
        resizeMode: 'stretch'
    },
    title: {
        fontSize: 13,
        fontWeight: 'bold',
        padding: 10
    },
    priceContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    price: {
        fontSize: 13,
        fontWeight: 'bold'
    }
});