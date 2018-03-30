import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

import { NewPatientForm } from '../components';

class NewPatientModal extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        patientForm: PropTypes.object,
        onCancel: PropTypes.func,
        show: PropTypes.bool
    }

    static defaultProps = {
        list: {},
        patientForm: {},
        onCancel: () => {},
        show: true
    }

    constructor(props) {
        super(props);

        this.cancel = this.cancel.bind(this);
    }

    cancel() {
        this.props.onCancel();
    }

    render() {
        return (
            <Modal show={this.props.show}>
                <Modal.Header>
                    <Modal.Title>Create New Patient</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <NewPatientForm
                        translator={this.props.translator}
                        {...this.props.patientForm}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.cancel}>Cancel</Button>
                    <Button bsStyle="primary">Create</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default NewPatientModal;