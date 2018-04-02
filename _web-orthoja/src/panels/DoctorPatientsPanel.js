import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Panel, Button, Popover, Overlay } from 'react-bootstrap';

import { PatientsList } from '../components';
import { NewPatientModal } from '../modals';
import FontAwesome from 'react-fontawesome';

class DoctorPatientsPanel extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        showNewPatientModal: PropTypes.bool,
        onNewPatientClick: PropTypes.func,
        list: PropTypes.object,
        patientForm: PropTypes.object,
        errorNotification: PropTypes.string
    }

    static defaultProps = {
        list: {},
        patientForm: {},
        showNewPatientModal: false,
        onNewPatientClick: () => {},
        errorNotification: null
    }

    constructor(props) {
        super(props);

        // Method Bindings
        this.DashboardElement = this.DashboardElement.bind(this);
    }

    DashboardElement({ ...props }) {

        const buttonNewPatient = (
            <Button onClick={ () => { this.props.onNewPatientClick(true) } }>
                <FontAwesome name="user-plus" />&nbsp;
                <span>{this.props.translator('doctor.panel.dashboard.create-patient')}</span>
            </Button>
        )

        const popoverCreatePatient = (
            <Popover
                id="popover-create-patient"
                title={this.props.translator('tips.get-started')}
                placement="right"
                positionLeft={165}
                positionTop={-32}
                className="glowing-notice"
                style={{zIndex: 1, width: '150px'}}
            >
                {this.props.translator('tips.create-patient')}
            </Popover>
        );

        return (
            <div {...props} style={{ paddingBottom: '10px', textAlign: 'left' }}>
                {this.props.list.patients.length <= 0 ? popoverCreatePatient : false}
                {buttonNewPatient}
            </div>
        )
    }

    render() {
        return (
            <div>
                <NewPatientModal
                    translator={this.props.translator}
                    patientForm={this.props.patientForm}
                    onCancel={ () => { this.props.onNewPatientClick(false) } }
                    show={this.props.showNewPatientModal}
                    errorNotification={this.props.errorNotification}
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