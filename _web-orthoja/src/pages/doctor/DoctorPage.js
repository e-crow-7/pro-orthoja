import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push } from 'react-router-redux';
import { withCookies } from 'react-cookie';
import { getTranslate } from 'react-localize-redux';

import { AccountBanner, Footer } from '../../components';
import { DoctorPatientsPanel } from '../../panels';

import * as Actions from '../../redux/actions';

import styles from './DoctorPage.scss';

@connect(
    (store) => ({
        translator: getTranslate(store.locale),
        account: store.account,
        doctor: store.doctor
    }),
    (dispatcher) => ({
        logoutRequest: (session) => (
            dispatcher(Actions.account.doctorLogoutRequest(session))
        ),
        setSession: (session, type) => (
            dispatcher(Actions.account.set(session, type))
        ),
        getAccountInformation: (session) => (
            dispatcher(Actions.doctor.accountInformationRequest(session))
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
        this.doctorFullName = this.doctorFullName.bind(this);
    }

    componentWillMount() {
        this.checkSession();
    }

    componentDidMount() {
        // Get the account information if a session exists (which it should).
        if (this.props.account.session) {
            this.props.getAccountInformation(this.props.account.session);
        }
    }

    componentDidUpdate() {
        this.checkSession();
    }

    checkSession() {
        if (this.props.account.session == null) {
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
        if (session != null && type === 'doctor') {
            return true;
        }
        return false;
    }

    logout() {
        this.props.logoutRequest(this.props.account.session);
        this.props.setSession(null, null);
    }

    renderRedirect() {
        return (
            <Redirect to={{
                pathname: '/',
                state: { from: this.props.location }
            }} />
        )
    }

    doctorFullName() {
        const { firstname, lastname } = this.props.doctor;
        if (firstname && lastname) {
            return 'Dr. ' + firstname + ' ' + lastname;
        }
        return '-';
    }

    render() {

        if (!this.authenticate()) {
            return (this.renderRedirect());
        }

        return (
            <div className={styles.container}>
                <AccountBanner
                    translator={this.props.translator}
                    accountName={this.doctorFullName()}
                    buttons={[
                        { title: this.props.translator("account.settings"), onClick: () => {} },
                        { title: this.props.translator("account.logout"), onClick: this.logout }
                    ]}
                />
                <DoctorPatientsPanel
                    translator={this.props.translator}
                    list={{
                        patients: [
                            {username: "patient2A4G4"},
                            {username: "patient4GHE4"},
                            {username: "patient85J6I"}
                        ]
                    }}
                />
                <Footer translator={this.props.translator} />
            </div>
        );
    }

}

export default DoctorPage;