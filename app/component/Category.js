import React, {Component} from 'react';
import {
    Platform, 
    StyleSheet, 
    Text, 
    View, 
    Image
} from 'react-native';

export default class Category extends Component {

    render() {
        return(
            <View style={{height: 130,borderRadius: 5,elevation:3, width: 130, marginLeft:20, borderWidth:0.5, borderColor: '#455a64'}}>
                <View style={{flex: 2}}>
                    <Image source={this.props.imageUri} 
                        style={{flex: 1, width: null, height: null, resizeMode: 'cover'}}
                        
                    />
                </View>
                <View style={{flex:1,paddingLeft:35,paddingTop:10}}>
                    <Text>{this.props.name}</Text>
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