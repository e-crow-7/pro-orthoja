import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Panel, Carousel, Button, Popover, Overlay, DropdownButton, MenuItem, Breadcrumb } from 'react-bootstrap';

import { PatientsList, PatientDailiesManager } from '../components';
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
        onDeleteButtonClick: () => { }
    }

    constructor(props) {
        super(props);

        // State
        this.state = {
            navigationStack: [],
            currentSelectedPatientData: null
        }

        // Method Bindings
        this.DashboardElement = this.DashboardElement.bind(this);
        this.PatientsManagerElement = this.PatientsManagerElement.bind(this);
        this.navigatePush = this.navigatePush.bind(this);
        this.navigateBackTo = this.navigateBackTo.bind(this);
        this.setCurrentPatient = this.setCurrentPatient.bind(this);
    }

    DashboardElement({ ...props }) {

        const buttonNewPatient = (
            <Button onClick={() => { this.props.onNewPatientClick(true) }}>
                <span><FontAwesome name="user-plus" />&nbsp;</span>
                <span>{this.props.translator('doctor.panel.dashboard.create-patient')}</span>
            </Button>
        )

        const buttonPatientDelete = (
            <Button onClick={this.props.onDeleteButtonClick} disabled={!this.props.enableDeleteButton}>
                <span><FontAwesome name="trash" /></span>
            </Button>
        )

        return (
            <div {...props} style={{ paddingBottom: '10px' }}>
                <div style={{ width: 'auto', float: 'left' }}>
                    {buttonNewPatient}
                </div>
                <div style={{ width: 'auto', float: 'right' }}>
                    {buttonPatientDelete}
                </div>
            </div>
        )
    }

    PatientsManagerElement() {
        return (
            <div>
                <this.DashboardElement />
                <PatientsList
                    emptyText={this.props.translator('doctor.panel.patients-not-found')}
                    onPatientClick={this.setCurrentPatient}
                    {...this.props.list}
                />
            </div>
        );
    }

    setCurrentPatient(patient) {
        if (!this.state.currentSelectedPatientData) {
            this.setState({
                currentSelectedPatientData: patient
            })
            this.navigatePush({
                title: patient.username,
                carouselIndex: 1
            });
        }
    }

    navigatePush(data) {
        this.setState((prevState) => {
            const newState = { ...prevState };

            const index = newState.navigationStack.length + 1;
            newState.navigationStack.push({ index: index, props: data });
            return newState;
        })
    }

    navigateBackTo(index) {
        if (index > (this.state.navigationStack.length - 1)) {
            return;
        }
        this.setState((prevState) => {
            const newState = { ...prevState };
            newState.navigationStack.splice(index, newState.navigationStack.length);
            if (index === 0) {
                newState.currentSelectedPatientData = null;
            }
            return newState;
        });
    }

    render() {

        const carouselIndex = this.state.navigationStack.length > 0 ?
            this.state.navigationStack.slice(-1)[0].props.carouselIndex : 0;

        const popoverCreatePatient = (
            <Popover
                id="popover-create-patient"
                title={this.props.translator('tips.get-started')}
                placement="right"
                positionLeft={180}
                positionTop={20}
                className="glowing-notice"
                style={{ zIndex: 1, width: '150px' }}
            >
                {this.props.translator('tips.create-patient')}
            </Popover>
        );

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
                        <Breadcrumb style={{ textAlign: 'left' }}>
                            <span><FontAwesome name="angle-double-right" />&nbsp;</span>
                            <Breadcrumb.Item
                                href="#"
                                onClick={() => {
                                    this.navigateBackTo(0);
                                }}
                            >
                                Patients
                            </Breadcrumb.Item>
                            {
                                this.state.navigationStack.map((stack, index) => {
                                    return (
                                        <Breadcrumb.Item
                                            key={index}
                                            href="#"
                                            onClick={() => {
                                                this.navigateBackTo(stack.index);
                                            }}
                                        >{stack.props.title}</Breadcrumb.Item>
                                    )
                                })
                            }

                        </Breadcrumb>
                        {this.props.list.patients.length <= 0 ? popoverCreatePatient : false}
                        <Carousel
                            controls={false}
                            indicators={false}
                            interval={null}
                            defaultActiveIndex={0}
                            activeIndex={carouselIndex}
                        >
                            <Carousel.Item>
                                <this.PatientsManagerElement />
                            </Carousel.Item>
                            <Carousel.Item>
                                <PatientDailiesManager patientData={this.state.currentSelectedPatientData} />
                            </Carousel.Item>
                        </Carousel>
                    </Panel.Body>
                </Panel>
            </div>
        )
    }

}

export default DoctorPatientsPanel;