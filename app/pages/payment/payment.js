import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View, 
        Image, 
        StatusBar, 
        TextInput, 
        ScrollView,
        TouchableOpacity,
        Dimensions,
        WebView,
        Modal
    } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createAppContainer, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
// import WebView from 'react-native-webview';

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class Payment extends Component {

    constructor(props){
        super(props);
        this.state={
            showModal: false,
            status: 'Pending'
        }
    }

    cod = () => {
        const type= 'COD';
        this.props.navigation.navigate('Confirmation',{payment:type});
    }

    handleResponse = data => {
        const type= 'Paypal';
        if(data.title === 'success'){
            this.setState({showModal: false, state: 'Completed'});
            this.props.navigation.navigate('Confirmation',{payment: type});
        }else if(data.title === 'cancel'){
            this.setState({showModal: false, state: 'Canceled'});
        }else{
            return;
        }
    }

    render() {
        const {navigation} = this.props;
        const totalPrice = navigation.getParam('totalPrice','N/A');
        return (
          <View style={styles.container}>
              <ScrollView>
                  <View style={{height: 5, width:Window.width}}/>
                  <View style={styles.titleContainer}>
                    <Text style={styles.yourParment}>Payment</Text>
                  </View>
                  <View style={{height: 5, width:Window.width}}/>
                    <View style={styles.paymentContainer}>
                        <Modal
                            visible={this.state.showModal}
                            onRequestClose={() => this.setState({ showModal: false })}
                        >
                            <WebView source={{ uri: "http://192.168.43.35:8080"}}
                                onNavigationStateChange={data => this.handleResponse(data)}
                            />
                        </Modal>
                        <TouchableOpacity
                            onPress={() => this.setState({showModal: true})}
                        >
                        <Image
                            style={{height: 100, width: 250,padding: 10}}
                            source={require('../../images/paypal.png')}
                        />
                        </TouchableOpacity>
                    </View>
                    <View style={{height: 5, width:Window.width}}/>
                    <View style={styles.paymentContainer}>
                        <TouchableOpacity onPress={this.cod}>
                        <Image
                            style={{height: 100, width: 250,padding: 10}}
                            source={require('../../images/cod.png')}
                        />
                        </TouchableOpacity>
                    </View>
              </ScrollView>
              <View style={{position: 'absolute', left: 0, right: 0, bottom: 0}}>
                <View style={{backgroundColor: 'pink', flex: 1}}>
                    <View style={{widht: 350,flexDirection: 'row'}}>
                        <Text style={{paddingTop: 14, paddingLeft: 14, paddingBottom: 14, paddingRight: 5}}>Status:</Text>
                        <Text style={{fontWeight: 'bold', paddingTop: 14, paddingBottom: 14}}>Select Payment</Text>
                    </View>
                </View>
              </View>
          </View>
        );
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccc'
    },
    titleContainer: {
        elevation: 3,
        paddingBottom: 3,
        alignSelf: 'center',
        width: Window.width - 10,
        borderRadius: 3,
        backgroundColor: 'white'
    },
    yourParment:{
        padding: 10,
        fontSize: 18,
        fontWeight: 'bold'
    },
    paymentContainer: {
        elevation: 3,
        paddingBottom: 3,
        alignSelf: 'center',
        width: Window.width - 10,
        borderRadius: 3,
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row'
    }
    // paymentContainer:{
    //     elevation: 3,
    //     paddingBottom: 3,
    //     alignSelf: 'center',
    //     width: Window.Width - 10,
    //     borderRadius: 3,
    //     backgroundColor: 'white',
    //     flex:1 ,
    //     flexDirection: 'row'
    // },
});