import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Panel, Modal, Button } from 'react-bootstrap';

import { PatientsList } from '../components';

class DoctorPatientsPanel extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        list: PropTypes.object,
    }

    static defaultProps = {
        list: {}
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Panel style={this.props.style}>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                            {this.props.translator('doctor.panel.title-patients')}
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>

                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>Create New Patient</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>The form to be placed here...</Modal.Body>

                            <Modal.Footer>
                                <Button>Close</Button>
                                <Button bsStyle="primary">Save changes</Button>
                            </Modal.Footer>
                        </Modal.Dialog>

                        <PatientsList
                            emptyText={this.props.translator('doctor.panel.patients-not-found')}
                            {...this.props.list}
                        />
                    </Panel.Body>
                </Panel>
            </div>
        )
    }

}

export default DoctorPatientsPanel;