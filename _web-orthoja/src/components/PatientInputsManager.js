import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

import NewInputForm from './NewInputForm';
import PatientInputsList from './PatientInputsList';
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
            inputs: null,
            isLoadingInputs: false,
            displayCreateInputModal: false
        }

        // Method bindings
        this.getInputs = this.getInputs.bind(this);
        this.dashboardElement = this.dashboardElement.bind(this);
        this.newInputFormModalElement = this.newInputFormModalElement.bind(this);
        this.inputsElement = this.inputsElement.bind(this);
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
            isLoadingInputs: true
        });
        this.props.getInputs(
            this.props.account.session, 
            this.props.patientData.username,
            this.props.dailyData._id
        ).then(
            (result) => {
                this.setState({
                    inputs: result.action.payload.data.payload.inputs,
                    isLoadingInputs: false
                });
            },
            (error) => {
                this.setState({
                    isLoadingInputs: false
                });
            }
        );
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

    dashboardElement() {
        return (
            <div style={{ marginTop: '10px', textAlign: 'left' }}>
                <Button onClick={() => {
                    this.setState({
                        displayCreateInputModal: true
                    })
                }}>
                    <FontAwesome name="plus-circle" />
                    &nbsp;Create New Input
                </Button>
            </div>
        );
    }

    newInputFormModalElement({ show }) {
        return (
            <Modal show={show}>
                <Modal.Header>
                    <Modal.Title>Create New Input</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <NewInputForm 
                        translator={this.props.translator}
                        onStateChange={(state) => {
                            /*this.setState({
                                newDialyFormData: state
                            });*/
                        }} 
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={() => {
                        this.setState({
                            displayCreateInputModal: false
                        })
                    }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={null}
                        bsStyle="primary"
                    >
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    inputsElement() {

        var inputs = this.state.inputs;
        if (inputs) {
            inputs = inputs.length > 0 ? inputs : null;
        }

        const noInputsElement = (
            <div style={{ padding: '20px 20px' }}>
                <i>No inputs Found</i>
            </div>
        );

        return (
            <Well style={{ marginTop: '10px' }}>
                {inputs ? 
                    <PatientInputsList
                        inputs={inputs}
                        translator={this.props.translator}
                    /> :
                    noInputsElement}
                <this.loadingOverlayElement show={this.state.isLoadingInputs} />
            </Well>
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
                    <this.dashboardElement />
                    <this.inputsElement />
                </div>
                <this.newInputFormModalElement show={this.state.displayCreateInputModal} />
            </div>
        );
    }

}

export default PatientInputsManager;