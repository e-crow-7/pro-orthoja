import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import { Label, Well, Grid, Row, Col } from 'react-bootstrap';
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
    })
)
class PatientDailiesManager extends Component {

    static propTypes = {
        patientData: PropTypes.object.required
    }

    static defaultProps = {
        patientData: null
    }

    toSexText(sex) {
        switch(sex) {
            case 'm': return 'Male'
            case 'f': return 'Female'
            default: return null
        }
    }

    toBirthdayText(isoDateString) {
        if(!isoDateString) { return null; }
        const date = new Date(isoDateString);
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-us', options);
    }

    render() {

        const patient = this.props.patientData || {};
        const additionalInfo = [
            { label: 'Nickname', data: patient.nickname || 'N/A' },
            { label: 'Sex', data: this.toSexText(patient.sex) || 'N/A' },
            { label: 'Birthday', data: this.toBirthdayText(patient.birthdate) || 'N/A' },
            { label: 'Race', data: patient.race || 'N/A' },
            { label: 'Country', data: patient.country || 'N/A' },
            { label: 'Region', data: patient.region || 'N/A' }
        ]


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
                    <div
                        style={{
                            textAlign: 'left', marginLeft: '10px',
                            position: 'relative', top: '4px'
                        }}
                    >
                        Details
                    </div>
                    <Well style={{ padding: '10px 10px' }}>
                        <Grid>
                            <Row>
                                {additionalInfo.map((info, index) => {
                                    return (
                                        <Col md={4} >
                                            <div style={{ textAlign: 'left' }}>
                                                <span>
                                                    <strong>{info.label}:</strong>
                                                    &nbsp;
                                                    {info.data}
                                                </span>
                                            </div>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Grid>
                    </Well>
                </div>
            </div>
        );
    }

}

export default PatientDailiesManager;