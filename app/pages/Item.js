
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
    AsyncStorage
} from 'react-native';

export default class App extends Component {

    static navigationOptions = ({navigation, screenProps}) => ({
        title: 'Product'
    });

    constructor(props){
        super(props);
        this.state={
            data: []
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

    componentDidMount(){
        this.fetchItem();
    }

    render() {
        return (
        <View style={styles.container}>
            {
                this.state.data.map((item,i) => {
                    return(
                        <View>
                            <Text>{item.item_name}</Text>
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
    backgroundColor: '#455a64',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
