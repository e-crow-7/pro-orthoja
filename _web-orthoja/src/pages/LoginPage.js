import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { Title, Footer } from '../components';
import { LoginPanel } from '../panels';

import * as Actions from '../redux/actions';

import styles from './LoginPage.scss';

@connect(
    (store) => ({
        translator: getTranslate(store.locale)
    }),
    (dispatcher) => ({
        doctorLoginRequest: (username, password) => (
            dispatcher(Actions.account.doctorLoginRequest(username, password))
        )
    })
)
class LoginPage extends Component {

    constructor(props) {
        super(props);

        // Method bindings
        this.login = this.login.bind(this);
    }

    login(username, password) {
        this.props.doctorLoginRequest(username, password);
    }

    render() {
        return(
            <div className={styles.container}>
                <Title text={'Orthoja'} />
                <LoginPanel translator={this.props.translator} onSignIn={this.login} />
                <Footer translator={this.props.translator} />
            </div>
        )
    }

}

export default LoginPage;