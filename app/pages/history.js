import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    StatusBar,
    TextInput,
    ScrollView,
    TourchableOpacity,
    Dimensions,
    WebView,
    Modal
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const Window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
}

export default class History extends Component{
    static navigationOptions = {
        title: 'History'
    }

    constructor(props){
        super(props);
        this.state = {
            histDel: [],
            histUser: [],
            histItem: []
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <ScrollView>
                    <View style={{height: 2, width:Window.width}}/>
                    <View style={styles.contentContainer}>
                        <View style={styles.content}>

                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#ccc'
    },
    contentContainer:{
        flex: 1,
        flexDirection:'row',
        backgroundColor: 'white'
    },
    content: {
        height: 100,
        alignSelf: 'center'
    }
});