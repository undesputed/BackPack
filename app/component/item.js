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
    ActivityIndicator
} from 'react-native';

export default class Item extends Component {

    render() {
        return(
            <View style={{height: 150,backgroundColor:'white', borderRadius: 5,elevation: 3, width: 130, marginLeft:20, borderWidth:0.5, borderColor: '#455a64'}}>
                <View style={{flex: 2}}>
                    <Image source={this.props.imageUri} 
                        style={{flex: 1, width: null, height: 151, resizeMode: 'stretch'}}
                        
                    />
                </View>
                <View style={{flex:1,paddingLeft:35,paddingTop:10}}>
                    <Text style={{fontSize: 14, fontWeight: '500'}}>{this.props.name}</Text>
                </View>
                <View style={{flex:1,paddingLeft:35,paddingTop:10}}>
                    <Text style={{fontSize:12}}>{this.props.price} / {this.props.unit_measure}</Text>
                </View>
            </View>
            );
        }
    }
    
    const styles = StyleSheet.create({
        container: {
            backgroundColor: '#455a64',
            flex: 1,
        }
    });