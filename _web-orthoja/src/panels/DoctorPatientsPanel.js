import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Panel, Button, Popover, Overlay, Grid, Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';

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
        errorNotification: PropTypes.string,
        enableDeleteButton: PropTypes.bool,
        onDeleteButtonClick: PropTypes.func
    }

    static defaultProps = {
        list: {},
        patientForm: {},
        showNewPatientModal: false,
        onNewPatientClick: () => { },
        errorNotification: null,
        enableDeleteButton: false,
        onDeleteButtonClick: () => {}
    }

    constructor(props) {
        super(props);

        // Method Bindings
        this.DashboardElement = this.DashboardElement.bind(this);
    }

    DashboardElement({ ...props }) {

        const buttonNewPatient = (
            <Button onClick={() => { this.props.onNewPatientClick(true) }}>
                <span><FontAwesome name="user-plus" />&nbsp;</span>
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
                style={{ zIndex: 1, width: '150px' }}
            >
                {this.props.translator('tips.create-patient')}
            </Popover>
        );

        const buttonPatientDelete = (
            <Button onClick={this.props.onDeleteButtonClick} disabled={!this.props.enableDeleteButton}>
                <span><FontAwesome name="trash" /></span>
            </Button>
        )

        return (
            <div {...props} style={{ paddingBottom: '10px' }}>
                <div style={{ width: 'auto', float: 'left' }}>
                    {this.props.list.patients.length <= 0 ? popoverCreatePatient : false}
                    {buttonNewPatient}
                </div>
                <div style={{ width: 'auto', float: 'right' }}>
                    {buttonPatientDelete}
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <NewPatientModal
                    translator={this.props.translator}
                    patientForm={this.props.patientForm}
                    onCancel={() => { this.props.onNewPatientClick(false) }}
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