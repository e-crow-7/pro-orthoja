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
        getInputs: (session, patientUsername, dailyId) => (
            dispatcher(Actions.doctor.getPatientDailyInputsRequest(session, patientUsername, dailyId))
        ),
        createInput: (session, patientUsername, dailyId, input) => (
            dispatcher(Actions.doctor.createPatientDailyInputRequest(session, dailyId, input))
        ),
    })
)
class PatientInputsManager extends Component {

    static propTypes = {
        patientData: PropTypes.object.required,
        dailyData: PropTypes.object.required
    }

    static defaultProps = {
        patientData: null,
        dailyData: null,
    }

    constructor(props) {
        super(props);

        this.state = {
            inputs: null
        }

        // Method bindings
        this.getInputs = this.getInputs.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.dailyData) {
            if (prevProps.dailyData !== this.props.dailyData) {
                this.getInputs();
            }
        }
    }

    getInputs() {
        this.setState({
            isLoadingDailies: true
        });
        
        this.props.getInputs(
            this.props.account.session, 
            this.props.patientData.username,
            this.props.dailyData._id
        ).then(
            (result) => {

            },
            (error) => {
                
            }
        );
    }

    render() {

        const daily = this.props.dailyData || {};

        return (
            <div>
                <div>
                    <h3>
                        <span style={{ position: 'relative', top: '4px' }}>
                            {daily.name || '-'}
                        </span>
                    </h3>
                </div>
                <div>
                    
                </div>
            </div>
        );
    }

}

export default PatientInputsManager;