import React, {Component} from 'react';
import {Platform, 
        StyleSheet, 
        Text, 
        View, 
        Image, 
        StatusBar, 
        TextInput, 
        Modal,
        TouchableOpacity,
        ScrollView,
        RefreshControl
    } from 'react-native';
import Icon from 'react-native-vector-icons';
import Logo from '../component/logo';
import Signup from './signup';
import Form from '../component/form';
import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Button from 'apsl-react-native-button';
import Home from './Home';
import AsyncStorage from '@react-native-community/async-storage';
import RadioForm, 
    {RadioButton, 
    RadioButtonInput, 
    RadioButtonLabel} 
    from 'react-native-simple-radio-button';
import RadioGroup,{Radio} from "react-native-radio-input";
import { thisExpression } from '@babel/types';
import axios from 'axios';

export default class Login extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            user: [],
            showModal: false,
            question: [],
            refreshing: false,
            correctAnswer: '',
            confirmQuiz: '',
            id: '',
            confirm: []
        };
    }

    fetchUser = async() => {
        // const { user,pass } = this.state;
        const {user} = this.state.username;
        const {pass} = this.state.password;
        const response = await fetch('http://192.168.43.35:8080/login/'+user+'/'+pass);
        const accnt = await response.json();
        this.setState({user:accnt});
    }

    fetchQuiz = async() => {
        const response = await fetch('http://192.168.43.35:8080/getQuiz');
        const quiz = await response.json();
        this.setState({question:quiz});
    }

    fetchConfirm = async() => {
        const user_id = await AsyncStorage.getItem('user_id');
        var day = new Date().getDate();
        var month = new Date().getMonth()+1;
        var year = new Date().getFullYear();
        var date = year+'-'+month+'-'+day;
        const response = await fetch('http://192.168.43.35:8080/confirmQuiz/'+user_id+'/'+date);
        const con = await response.json();
        this.setState({confirm:con});
    }

    componentDidMount(){
        this.fetchUser();
        this.fetchQuiz();
    }

    // componentWillMount(){
    //     this.fetchConfirm();
    // }

    userLogin = async() => {
        const {username,password} = this.state;
        var url = 'http://192.168.43.35:80/adminBakpak/android/loginUser.php';
        var data = {
            user : username,
            pass : password
        }

        fetch(url,{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                user : username,
                pass : password
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                if(responseJson != 'Try Again'){
                    // alert(responseJson);
                    AsyncStorage.setItem('user_id',responseJson);
                    this.props.navigation.navigate('Home');
                // this.fetchConfirm();
                    // this.checkUser();
                }else{
                    alert(responseJson);
                }
            }).catch((error) => {
                console.error(error);
            })

    }

    checkUser = async() =>{
        var user_id = await AsyncStorage.getItem('user_id');
        this.setState({id:user_id});
        if(this.state.confirm && this.state.confirm.length > 0){
            this.props.navigation.navigate('Home');
        }else{
            this.setState({showModal:true});
            this.setState({showModal:false});
            if(this.state.confirm && this.state.confirm.length > 0){
                this.props.navigation.navigate('Home');
            }else{
                this.setState({showModal:true});
            }
        }
    }

    checkAns = async(ans) => {
        const user_id = await AsyncStorage.getItem('user_id');
        this.state.question.forEach((item)=>{
            this.setState({correctAnswer:item.answer});
        })
        if(ans == this.state.correctAnswer){
            var day = new Date().getDate();
            var month = new Date().getMonth()+1;
            var year = new Date().getFullYear();
            var date = year+'-'+month+'-'+day;
            const points = 'http://192.168.43.35:8080/updatePoints/'+user_id;
            axios.get(points).then(function(response){
                console.log(response);
            }).then(function(error){
                console.log(error);
            });
            const upQuiz = 'http://192.168.43.35:8080/updateQuiz/'+date+'/'+user_id;
            axios.get(upQuiz).then(function(response){
                console.log(response);
            }).then(function(error){
                console.log(error);
            })
            alert('Correct');
            this.setState({showModal:false});
            this.props.navigation.navigate('Home');
        }else{
            var day = new Date().getDate();
            var month = new Date().getMonth()+1;
            var year = new Date().getFullYear();
            var date = year+'-'+month+'-'+day;
            const upQuiz = 'http://192.168.43.35:8080/updateQuiz/'+date+'/'+user_id;
            axios.get(upQuiz).then(function(response){
                console.log(response);
            }).then(function(error){
                console.log(error);
            })
            alert('The Correct Answer is:'+this.state.correctAnswer);
            this.setState({showModal:false});
            this.props.navigation.navigate('Home');
        }
    }

    _onRefresh = () =>{
        this.setState({refreshing:true});
        this.fetchQuiz().then(() => {
            this.setState({refreshing:false})
        });
    }


    render() {
        const { opt1,opt2,opt3,opt4 } = this.state;
        return (
          <View style={styles.container}>
            <StatusBar backgroundColor="#1c313a"
            barStyle="light-content"/>
            <Logo/>
            <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)'
                    placeholder="Username"
                    placeholderTextColor="#ffffff"
                    onChangeText = {username => this.setState({username})}
                    returnKeyType = "next"
                    onSubmitEditing = {() => this.passwordInput.focus()}
                    autoCapitalize = "none"
                    autoCorrect = {false}/>
                <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    secureTextEntry={true} placeholder="Password"
                    placeholderTextColor="#ffffff"
                    onChangeText = {password => this.setState({password})}
                    ref = {(input) => this.passwordInput =input}/>

                <Button style={styles.buttonStyle8}
                        textStyle={styles.textStyle8}
                        onPress={this.userLogin}
                        // onPress={() => this.setState({showModal: true})}
                        >
                    <View style={styles.customViewStyle}>
                        <Text style={{fontFamily: 'Avenir', color:'white'}}>
                        LOGIN
                        </Text>
                    </View>
                </Button>
            <View style={styles.signUpText}>
                <Text style={styles.textSignUp}>Don't have an account yet? </Text>
                <Text styel={styles.signUpButton} onPress={() => this.props.navigation.navigate('Register')}>Sign-up</Text>
            </View>
            <View>
                <Modal 
                    visible={this.state.showModal}
                    onRequestClose={() => this.setState({ showModal: false })}
                >
                    {
                        this.state.question.map((item,i) => {
                            return(
                                <View style={{flex: 1, backgroundColor: '#ccc'}}>
                                    <ScrollView
                                        refreshControl={
                                            <RefreshControl
                                            refreshing={this.state.refreshing}
                                            onRefresh={this._onRefresh}
                                          />
                                        }
                                    >   
                                    <Text style={{fontSize:30, fontWeight: '700'}}>Question:</Text>
                                    <Text style={{padding: 10, fontWeight: 'bold',fontSize: 25}}>{item.main_question}</Text>
                                    <TouchableOpacity onPress={() => this.checkAns(item.opt1)}>
                                        <View style={{flex:1,alignSelf:'center'}}>
                                            <View style={{backgroundColor: 'white',borderRadius: 5, width: 350}}>
                                                <Text style={{fontSize: 15, textAlign: 'center', padding: 12, fontWeight: 'bold'}}>{item.opt1}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{height:1,backgroundColor:'#ccc',width:'100%'}}/>
                                    <TouchableOpacity onPress={() => this.checkAns(item.opt2)}>
                                        <View style={{flex:1,alignSelf:'center'}}>
                                            <View style={{backgroundColor: 'white',borderRadius: 5, width: 350}}>
                                                <Text style={{fontSize: 15, textAlign: 'center', padding: 12, fontWeight: 'bold'}}>{item.opt2}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{height:1,backgroundColor:'#ccc',width:'100%'}}/>
                                    <TouchableOpacity onPress={() => this.checkAns(item.opt3)}>
                                        <View style={{flex:1,alignSelf:'center'}}>
                                            <View style={{backgroundColor: 'white',borderRadius: 5, width: 350}}>
                                                <Text style={{fontSize: 15, textAlign: 'center', padding: 12, fontWeight: 'bold'}}>{item.opt3}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{height:1,backgroundColor:'#ccc',width:'100%'}}/>
                                    <TouchableOpacity onPress={() => this.checkAns(item.opt4)}>
                                        <View style={{flex:1,alignSelf:'center'}}>
                                            <View style={{backgroundColor: 'white',borderRadius: 5, width: 350}}>
                                                <Text style={{fontSize: 15, textAlign: 'center', padding: 12, fontWeight: 'bold'}}>{item.opt4}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    </ScrollView>
                                </View>           
                            );
                        })
                    }
                </Modal>
            </View>
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
    },
    signUpText: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginVertical: 16,
        flexDirection: 'row'
    },
    textSignUp: {
        color : 'rgba(255,255,255,0.6)',
        fontSize: 16
    },
    signUpButton: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '500'
    },
    inputBox: {
        width: 300,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 25,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#ffffff',
        marginVertical: 10
    },
    buttonStyle:{
        backgroundColor: '#1c313a',
        borderRadius: 25,
        width: 300,
        marginVertical: 10,
        paddingVertical: 12
    },  
    buttonLogin: {
        fontSize: 16,
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center'
    },
    buttonStyle8: {
        backgroundColor: '#1c313a',
        borderColor: '#333',
        borderWidth: 2,
        borderRadius: 25,
      },
    textStyle8: {
        width: 200,
        fontFamily: 'Avenir Next',
        fontWeight: '500',
        color: '#ffffff',
        textAlign: 'center',
    },
    customViewStyle: {
        width: 120,
        height: 40,
        alignItems: 'center',
        textAlign: 'center',
        paddingHorizontal: 30,
        flexDirection: 'row',
    }
});


// export default class App extends Component{
//     render(){
//         return(
//             <AppContainer/>
//         );
//     }
//   }
  
//   const AppStackContainer = createStackNavigator({
//       Login: Login,
//       Home: Home
//     }
//   );
  
//   const AppContainer = createAppContainer(AppStackContainer);