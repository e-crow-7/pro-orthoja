import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

@connect(
    (store) => ({
        account: store.account,
    }),
    (dispatcher) => ({})
)
class DoctorPage extends Component {

    constructor(props) {
        super(props);

        // Method bindings.
        this.authenticate = this.authenticate.bind(this);
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
                THE DOCTOR PAGE
            </div>
        );
    }

}

export default DoctorPage;