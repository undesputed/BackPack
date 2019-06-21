
import React, {Component} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';

import Routes from './app/Routes';
import Login from './app/pages/login';
import Signup from './app/pages/signup';
import Home from './app/pages/Home';
import Form from './app/component/form';
import Register from './app/component/registration';

export default class App extends Component {
  render() {
    return (
      <AppContainer />
    );
  }
}

const AppStackNavigator = createStackNavigator(
  {
    Login:  Login,
    Register : Signup,
    Home : Home,
    Form : Form
  },
  {
    initialRouteName : 'Login'
  }
);

const AppContainer = createAppContainer(AppStackNavigator);

// const MainNavigator = createStackNavigator({
//   Login: {screen: Login},
//   Register: {screen: SignUp}
// });

// const App = createAppContainer(MainNavigator);

// export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#455a64',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
