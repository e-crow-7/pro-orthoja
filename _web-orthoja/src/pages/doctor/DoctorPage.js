import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push } from 'react-router-redux';
import { withCookies } from 'react-cookie';

import { account as AccountActions } from '../../redux/actions';

@connect(
    (store) => ({
        account: store.account,
    }),
    (dispatcher) => ({
        logoutRequest: (session) => (
            dispatcher(AccountActions.doctorLogoutRequest(session))
        ),
        setSession: (session, type) => (
            dispatcher(AccountActions.set(session, type))
        ),
        push: (location) => (
            dispatcher(push(location))
        )
    })
)
@withCookies
class DoctorPage extends Component {

    constructor(props) {
        super(props);

        // Method bindings.
        this.authenticate = this.authenticate.bind(this);
        this.logout = this.logout.bind(this);
        this.checkSession = this.checkSession.bind(this);
    }

    componentWillMount() {
        this.checkSession();
    }

    componentDidUpdate() {
        this.checkSession();
    }

    checkSession() {
        if(this.props.account.session == null) {
            this.props.cookies.remove('session');
            this.props.cookies.remove('type');
            this.props.push('/');
        }
    }

    /**
     * Authenticates the access to this page.
     */
    authenticate() {
        const { session, type } = this.props.account;
        if(session != null && type === 'doctor') {
            return true;
        }
        return false;
    }

    logout() {
        this.props.logoutRequest(this.props.account.session);
        this.props.setSession(null, null);
    }

    renderRedirect() {
        return(
            <Redirect to={{
                pathname: '/',
                state: { from: this.props.location }
            }} />
        )
    }

    render() {

        if(!this.authenticate()) {
            return(this.renderRedirect());
        }

        return(
            <div>
                <p>THE DOCTOR PAGE</p>
                <button onClick={this.logout}>LOGOUT</button>
            </div>
        );
    }

}

export default DoctorPage;