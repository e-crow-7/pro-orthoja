import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Col, Form, FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import { CSSTransitionGroup } from 'react-transition-group';

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

                <CSSTransitionGroup
                    transitionName="login-errors"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {
                        this.props.errorNotification ?
                            (<Alert bsStyle="danger">
                                <h5>{this.props.translator('form.login.error-title')}</h5>
                                <p>{this.props.errorNotification}</p>
                            </Alert>)
                            : false
                    }
                </CSSTransitionGroup>

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
                    <div>
                        <ReactLoading
                            style={{
                                opacity: this.props.state === 'idle' ? 0.0 : 1.0,
                                display: this.props.state === 'idle' ? 'none' : null,
                                width: 32,
                                marginLeft: -16,
                                height: 32,
                                position: 'absolute',
                                top: 0,
                                left: '50%'
                            }}
                            type={'spin'}
                            color={'#222222'}
                            height={32} width={32}
                        />
                        <Button type="button" onClick={this.signIn}
                            style={{ opacity: this.props.state === 'idle' ? 1.0 : 0.0 }}
                        >
                            {this.props.translator('form.login.signin')}
                        </Button>
                    </div>

                </Form>
            </div>
        )
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default LoginForm;