
import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, FlatList, Dimensions} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';
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


export default class onCategory extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({
      title: navigation.state.params.name
    });

    constructor(props){
        super(props);
        this.state={
            data:[],
            refreshing: false
        }
    }

    showId = async()=>{
        const {navigation} = this.props;
        const id = navigation.getParam('id','N/A');
        const name = navigation.getParam('name','N/A');
        const catId = JSON.stringify(id);
        alert(catId);
    }

    fetchCategory = async()=>{
        const {navigation} = this.props;
        const id = navigation.getParam('id','N/A');
        const catId = JSON.stringify(id);
        const response = await fetch('http://192.168.43.35:8080/byCategory/'+catId);
        const category = await response.json();
        this.setState({data:category});
    }

    componentDidMount(){
        this.fetchCategory();
    }

    _onRefresh = () =>{
        this.setState({refreshing:true});
        this.fetchCategory().then(() => {
            this.setState({refreshing: false});
        });
    }
    
    render() {
        return (
                <FlatList
                    refreshing = {this.state.refreshing}
                    onRefresh={this._onRefresh}
                    data={this.state.data}
                    keyExtractor={(item,index) => index.toString()}
                    renderItem={({item}) => 
                    <TouchableOpacity onPress={() => this.props.navigation.push('perItem',{id:item.item_id})}>                    
                        <View style={styles.container}>
                            <View style={styles.cardContainer}>
                                <View style={styles.card}>
                                    <Image
                                        style={styles.image}
                                        source={{uri:item.item_image}}
                                        indicator={ProgressBar}
                                        indicatorProps={{
                                            size: 80,
                                            borderWidth: 0,
                                            color: 'rgba(150,150,150,1)',
                                            unfilledColor: 'rgba(200,200,200,0.2)'
                                        }}
                                    />
                                    <Text style={styles.title}>{item.item_name}</Text>
                                    <Text numberOfLines={2} style={styles.details}>{item.item_description}</Text>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.price}>₱{item.unit_price}/{item.unit_measure}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    }
                    numColumns={2}
                />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    cardContainer: { 
        height: 280,
        width: cardContainerSize.Width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        height: resizeComponent(280, 5),
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
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    priceContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    price: {
        fontSize: 13,
        fontWeight: 'bold'
    },
    details: {
        fontSize: 13,
        color: '#3c3c3c',
        paddingLeft: 10,
        paddingRight: 10
    }
});