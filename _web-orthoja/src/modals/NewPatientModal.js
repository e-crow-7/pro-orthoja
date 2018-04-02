import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Alert } from 'react-bootstrap';
import { CSSTransitionGroup } from 'react-transition-group';
import ReactLoading from 'react-loading';

import { NewPatientForm } from '../components';

class NewPatientModal extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        patientForm: PropTypes.object,
        onCancel: PropTypes.func,
        show: PropTypes.bool,
        errorNotification: PropTypes.string
    }

    static defaultProps = {
        list: {},
        patientForm: {},
        onCancel: () => { },
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

        const patientFormState = this.props.patientForm;
        const isIdle = patientFormState.requestStatus === 'idle';

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
                    <div style={{
                        display: isIdle ? 'none' : null,
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        top: 0,
                        left: 0,
                        zIndex: 100
                    }}>
                        <ReactLoading
                            style={{
                                width: 64,
                                marginTop: -32,
                                marginLeft: -32,
                                height: 64,
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                color: '#c7c7c7',
                                fill: '#222'
                            }}
                            type={'spin'}
                            color={'#222'}
                            height={64} width={64}
                        />
                    </div>
                    <CSSTransitionGroup
                    transitionName="login-errors"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}
                >
                    {
                        this.props.errorNotification ?
                            (<Alert bsStyle="danger">
                                <h5>{this.props.translator('error.generic.title')}</h5>
                                <p>{this.props.translator('error.'+this.props.errorNotification)}</p>
                            </Alert>)
                            : false
                    }
                </CSSTransitionGroup>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={this.cancel} disabled={!isIdle} >Cancel</Button>
                    <Button
                        disabled={!isIdle}
                        bsStyle="primary"
                        onClick={() => {
                            patientFormState.onSubmit();
                        }}
                    >
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default NewPatientModal;