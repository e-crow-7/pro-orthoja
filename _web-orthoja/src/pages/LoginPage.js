import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { push } from 'react-router-redux';

import { Title, Footer } from '../components';
import { LoginPanel } from '../panels';

import * as Actions from '../redux/actions';

import styles from './LoginPage.scss';

@connect(
    (store) => ({
        translator: getTranslate(store.locale),
        account: store.account,
        request: store.request
    }),
    (dispatcher) => ({
        doctorLoginRequest: (username, password) => (
            dispatcher(Actions.account.doctorLoginRequest(username, password))
        ),
        push: (location) => (
            dispatcher(push(location))
        )
    })
)
class LoginPage extends Component {

    constructor(props) {
        super(props);

        // Method bindings
        this.login = this.login.bind(this);
    }

    componentDidUpdate() {
        console.log(this.props.account);
        // Check to see if the account state has changed.
        // Redirect if the account state is filled.
        if(this.props.account.session != null) {
            if(this.props.account.type === 'doctor') {
                this.props.push('/doctor');
            }
        }
    }

    login(username, password) {
        this.props.doctorLoginRequest(username, password);
    }

    render() {

        const errorCode = this.props.request.error.code || this.props.account.error.code;

        return(
            <div className={styles.container}>
                <Title text={'Orthoja'} />
                <LoginPanel
                    translator={this.props.translator}
                    onSignIn={this.login}
                    state={this.props.request.status === Actions.request.ENUM_STATUS.PENDING ? 'pending' : 'idle'}
                    errorNotification={
                        errorCode ? 
                        this.props.translator('error.' + errorCode) : null
                    }
                />
                <Footer translator={this.props.translator} />
            </div>
        )
    }

}

export default LoginPage;