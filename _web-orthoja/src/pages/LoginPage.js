import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';
import { push } from 'react-router-redux';
import { withCookies } from 'react-cookie';

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
@withCookies
class LoginPage extends Component {

    constructor(props) {
        super(props);

        // Method bindings
        this.login = this.login.bind(this);
        this.checkSession = this.checkSession.bind(this);
    }

    componentWillMount() {
        this.checkSession();
    }

    componentDidUpdate() {
        this.checkSession();
    }

    checkSession() {
        // Check to see if the account state has changed.
        // Redirect if the account state is filled.
        if(this.props.account.session != null) {
            if(this.props.account.type === 'doctor') {
                this.props.cookies.set('session', this.props.account.session);
                this.props.cookies.set('type', this.props.account.type);
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
                    state={this.props.request.statusKey['login'] === Actions.request.ENUM_STATUS.PENDING ? 'pending' : 'idle'}
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