import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Panel, Button } from 'react-bootstrap';

import { PatientsList } from '../components';
import { NewPatientModal } from '../modals';
import FontAwesome from 'react-fontawesome';

class DoctorPatientsPanel extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        list: PropTypes.object,
        patientForm: PropTypes.object,
    }

    static defaultProps = {
        list: {},
        patientForm: {}
    }

    constructor(props) {
        super(props);

        this.state = {
            showNewPatientModal: false
        }

        // Method Bindings
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.DashboardElement = this.DashboardElement.bind(this);
    }

    showModal() {
        this.setState({
            showNewPatientModal: true
        })
    }

    hideModal() {
        this.setState({
            showNewPatientModal: false
        })
    }

    DashboardElement({...props}) {
        return (
            <div {...props} style={{paddingBottom: '10px', textAlign: 'left'}}>
                <Button onClick={this.showModal}>
                    <FontAwesome name="user-plus" />&nbsp;
                    <span>Create New Patient</span>
                </Button>
            </div>
        )
    }

    render() {
        return (
            <div>
                <NewPatientModal
                    translator={this.props.translator}
                    patientForm={this.props.patientForm}
                    onCancel={this.hideModal}
                    show={this.state.showNewPatientModal}
                />
                <Panel style={this.props.style}>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3">
                            {this.props.translator('doctor.panel.title-patients')}
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body>
                        <this.DashboardElement />
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