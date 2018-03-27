import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Col, Form, FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactLoading from 'react-loading';

import styles from './LoginForm.scss';
require('./LoginForm.css')

const STATE = {
    IDLE: 'idle',
    PENDING: 'pending'
}

class LoginForm extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        onSignIn: PropTypes.func,
        state: PropTypes.string,
        errorNotification: PropTypes.string,
    }

    static defaultProps = {
        onSignIn: () => { },
        state: STATE.IDLE
    }

    constructor(props) {
        super(props);

        this.state = {
            // Account signin information.
            username: '',
            password: '',
        }

        // Method binding.
        this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
        this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
        this.signIn = this.signIn.bind(this);
    }

    FieldElement({ id, label, ...props }) {
        /*
        <Col sm={2} componentClass={ControlLabel}>
            <ControlLabel>{label}</ControlLabel>
        </Col>
        */
        return (
            <FormGroup controlId={id}>
                <Col sm={12}>
                    <FormControl {...props} />
                </Col>
            </FormGroup>
        );
    }

    handleUsernameInputChange(event) {
        this.setState({
            username: event.target.value
        })
    }

    handlePasswordInputChange(event) {
        this.setState({
            password: event.target.value
        })
    }

    signIn() {
        this.props.onSignIn(this.state.username, this.state.password);
    }

    render() {
        return (
            <div className={styles.container}>

                {
                    this.props.errorNotification ?
                        <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
                            <h4>Login Error</h4>
                            <p>
                                Credentials Invalid.
                            </p>
                        </Alert>
                        : false
                }

                <Form horizontal>
                    <this.FieldElement
                        id="field-username"
                        label={this.props.translator('form.login.username')}
                        type="text"
                        placeholder={this.props.translator('form.login.username')}
                        value={this.state.username}
                        onChange={this.handleUsernameInputChange}
                        disabled={this.props.state === STATE.PENDING}
                    />
                    <this.FieldElement
                        id="field-password"
                        label={this.props.translator('form.login.password')}
                        type="password"
                        placeholder={this.props.translator('form.login.password')}
                        value={this.state.password}
                        onChange={this.handlePasswordInputChange}
                        disabled={this.props.state === STATE.PENDING}
                    />
                    <ReactCSSTransitionGroup
                        transitionName="signin-button"
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                    >
                        {
                            this.props.state === 'idle' ?
                                <Button type="button" onClick={this.signIn}>
                                    {this.props.translator('form.login.signin')}
                                </Button>
                                :
                                <ReactLoading
                                    type={'spin'}
                                    color={'#222222'}
                                    height={32} width={32}
                                />
                        }
                    </ReactCSSTransitionGroup>
                </Form>
            </div>
        )
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default LoginForm;