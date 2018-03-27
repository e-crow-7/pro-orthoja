import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Panel } from 'react-bootstrap';

import { LoginForm } from '../components';

class LoginPanel extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        onSignIn: PropTypes.func,
        state: PropTypes.string,
        errorNotification: PropTypes.string
    }

    static defaultProps = {
        onSignIn: () => {},
        state: 'idle'
    }

    constructor(props) {
        super(props);

        this.signIn = this.signIn.bind(this);
    }

    signIn(username, password) {
        this.props.onSignIn(username, password);
    }

    render() {
        return (
            <div>
                <Panel style={this.props.style}>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                            {this.props.translator('form.login.title')}&nbsp;
                            ({this.props.translator('form.login.doctor-type')})
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <LoginForm
                            translator={this.props.translator}
                            onSignIn={this.signIn}
                            state={this.props.state}
                            errorNotification={this.props.errorNotification}
                        />
                    </Panel.Body>
                </Panel>
            </div>
        )
    }

}

export default LoginPanel;