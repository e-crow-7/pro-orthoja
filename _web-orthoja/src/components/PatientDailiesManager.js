import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import NewPatientDailyForm from './NewPatientDailyForm';
import PatientDailiesList from './PatiantDailiesList';
import ReactLoading from 'react-loading';
import { Modal, Label, Well, Grid, Row, Col, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import * as Actions from '../redux/actions'

@connect(
    (store) => ({
        translator: getTranslate(store.locale),
        account: store.account,
        doctor: store.doctor
    }),
    (dispatcher) => ({
        getPatientDailies: (session, username) => (
            dispatcher(Actions.doctor.getPatientDailiesRequest(session, username))
        ),
        createPatientDaily: (session, username, daily) => (
            dispatcher(Actions.doctor.createPatientDailyRequest(session, username, daily))
        ),
    })
)
class PatientDailiesManager extends Component {

    static propTypes = {
        patientData: PropTypes.object.required,
        onDailySelect: PropTypes.func
    }

    static defaultProps = {
        patientData: null,
    }

    constructor(props) {
        super(props);

        this.state = {
            patientDailies: null,
            isLoadingDailies: false,
            displayCreateDailyModal: false,
            newDialyFormData: null,
            onDailySelect: () => {}
        }

        // Method bindings.
        this.getPatientDailies = this.getPatientDailies.bind(this);
        this.submitNewDaily = this.submitNewDaily.bind(this);
        this.patientDashboardElement = this.patientDashboardElement.bind(this);
        this.patientInformationElement = this.patientInformationElement.bind(this);
        this.patientDailiesElement = this.patientDailiesElement.bind(this);
        this.newDailyFormModalElement = this.newDailyFormModalElement.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.patientData) {
            if (prevProps.patientData !== this.props.patientData) {
                this.getPatientDailies();
            }
        }
    }

    getPatientDailies() {
        this.setState({
            isLoadingDailies: true
        });
        this.props.getPatientDailies(this.props.account.session, this.props.patientData.username).then(
            (result) => {
                this.setState({
                    patientDailies: result.action.payload.data.payload.dailies,
                    isLoadingDailies: false
                });
            },
            (error) => {
                this.setState({
                    isLoadingDailies: false
                });
            }
        );
    }

    submitNewDaily() {
        const dailyState = this.state.newDialyFormData;
        console.log('DailyState:', dailyState);
        if(dailyState == null || dailyState.type == null) {
            return;
        }

        const daily = {};
        daily["name"] = dailyState.type;
        if(dailyState.for.length > 0) {
            daily["name"] = daily["name"] + '.' + dailyState.for;
        } else {
            daily["name"] = daily["name"] + '.default';
        }
        daily["name"] = '[' + daily["name"] + ']'
        if(dailyState.half.length > 0) {
            daily["name"] = daily["name"] + ' ([sagittal.' + dailyState.half + '])';
        }

        daily["type"] = dailyState.type;

        console.log('DAILY: ', daily);

        this.props.createPatientDaily(
            this.props.account.session,
            this.props.patientData.username,
            daily
        ).then(
            (result) => {
                this.setState({
                    displayCreateDailyModal: false
                });
                this.getPatientDailies();
            },
            (error) => {

            }
        );
    }

    toSexText(sex) {
        switch (sex) {
            case 'm': return 'Male'
            case 'f': return 'Female'
            default: return null
        }
    }

    toBirthdayText(isoDateString) {
        if (!isoDateString) { return null; }
        const date = new Date(isoDateString);
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-us', options);
    }

    loadingOverlayElement({ show, ...props }) {
        return (
            <div style={{
                display: show ? null : 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255,255,255,0.5)'
            }}>
                <ReactLoading
                    style={{
                        width: 32,
                        marginTop: -16,
                        marginLeft: -16,
                        height: 32,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        fill: '#222'
                    }}
                    type={'spin'}
                    color={'#222222'}
                    height={32} width={32}
                />
            </div>
        );
    }

    patientInformationElement({patientData}) {

        const patient = patientData || {};
        const additionalInfo = [
            { label: 'Nickname', data: patient.nickname || 'N/A' },
            { label: 'Sex', data: this.toSexText(patient.sex) || 'N/A' },
            { label: 'Birthday', data: this.toBirthdayText(patient.birthdate) || 'N/A' },
            { label: 'Race', data: patient.race || 'N/A' },
            { label: 'Country', data: patient.country || 'N/A' },
            { label: 'Region', data: patient.region || 'N/A' }
        ];

        const infoElements = additionalInfo.map((info, index) => {
            return (
                <Col sm={6} md={4} >
                    <div style={{ textAlign: 'left' }}>
                        <span>
                            <strong>{info.label}:</strong>
                            &nbsp;
                            {info.data}
                        </span>
                    </div>
                </Col>
            );
        });

        return (
            <Well style={{ padding: '10px 10px', marginTop: '10px' }}>
                <Grid>
                    <Row>
                        {infoElements}
                    </Row>
                </Grid>
            </Well>
        );
    }

    patientDashboardElement() {
        return (
            <div style={{ marginTop: '10px', textAlign: 'left' }}>
                <Button onClick={() => {
                    this.setState({
                        displayCreateDailyModal: true
                    })
                }}>
                    <FontAwesome name="plus-circle" />
                    &nbsp;Create New Daily
                </Button>
            </div>
        );
    }

    patientDailiesElement() {

        var dailies = this.state.patientDailies;
        if (dailies) {
            dailies = dailies.length > 0 ? dailies : null;
        }

        const noDailiesElement = (
            <div style={{ padding: '20px 20px' }}>
                <i>No Dailies Found</i>
            </div>
        );

        return (
            <Well style={{ marginTop: '10px' }}>
                {dailies ? 
                    <PatientDailiesList
                        dailies={dailies}
                        translator={this.props.translator}
                        onDailyClick={(daily) => {
                            this.props.onDailySelect(daily);
                        }}
                    /> :
                    noDailiesElement}
                <this.loadingOverlayElement show={this.state.isLoadingDailies} />
            </Well>
        );
    }

    newDailyFormModalElement({ show }) {
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>Create New Daily</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <NewPatientDailyForm onStateChange={(state) => {
                        this.setState({
                            newDialyFormData: state
                        });
                    }} />
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={() => {
                        this.setState({
                            displayCreateDailyModal: false
                        })
                    }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={this.submitNewDaily}
                        bsStyle="primary"
                    >
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {

        const patient = this.props.patientData || {};

        return (
            <div>
                <div>
                    <h3>
                        <span style={{ position: 'relative', top: '4px' }}>
                            {patient.username}
                        </span>
                        <span>&nbsp;</span>
                        {
                            patient.nickname ?
                                <Label>{patient.nickname}</Label> :
                                false
                        }
                    </h3>
                </div>
                <div>
                    <this.patientDashboardElement />
                    <this.patientInformationElement patientData={patient} />
                    <this.patientDailiesElement />
                </div>
                <this.newDailyFormModalElement show={this.state.displayCreateDailyModal} />
            </div>
        );
    }

}

export default PatientDailiesManager;