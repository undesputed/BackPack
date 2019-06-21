import React, {Component} from 'react';
import {Router, Stack, Scene} from 'react-native-router-flux';

import Login from './pages/login';
import Signup from './pages/signup';

export default class Routes extends Component {
    render() {
        return (
            <Router>
                <Stack key="root" hideNavBar={true}>
                    <Scene key="Login" component={Login} title="Login" initial={true}/>
                    <Scene key="register" component={Signup} title="Register"/>
                </Stack>
            </Router>
        )
    }
}