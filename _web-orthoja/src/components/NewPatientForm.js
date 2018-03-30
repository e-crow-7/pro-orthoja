import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Col, Form, FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import { CSSTransitionGroup } from 'react-transition-group';

import styles from './NewPatientForm.scss';

class NewPatientForm extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired
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
                
            </div>
        )
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default NewPatientForm;