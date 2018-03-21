import React, { Component } from 'react';
import { Panel, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import styles from './LoginForm.scss';

class LoginForm extends Component {

    render() {
        return (
            <div className={styles.container}>
                <Panel className={styles.panel}>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">Login</Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>Username</Panel.Body>
                </Panel>
            </div>
        )
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default LoginForm;