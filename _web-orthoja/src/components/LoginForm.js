import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Col, Form, FormGroup, FormControl, Button } from 'react-bootstrap';

import styles from './LoginForm.scss';

class LoginForm extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        onSignIn: PropTypes.func
    }

    static defaultProps = {
        onSignIn: () => { }
    }

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: ''
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

                <Form horizontal>
                    <this.FieldElement
                        id="field-username"
                        label={this.props.translator('form.login.username')}
                        type="text"
                        placeholder={this.props.translator('form.login.username')}
                        value={this.state.username}
                        onChange={this.handleUsernameInputChange}
                    />
                    <this.FieldElement
                        id="field-password"
                        label={this.props.translator('form.login.password')}
                        type="password"
                        placeholder={this.props.translator('form.login.password')}
                        value={this.state.password}
                        onChange={this.handlePasswordInputChange}
                    />
                    <Button type="button" onClick={this.signIn}>
                        {this.props.translator('form.login.signin')}
                    </Button>
                </Form>
            </div>
        )
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default LoginForm;