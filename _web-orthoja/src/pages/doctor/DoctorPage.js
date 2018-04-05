import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push } from 'react-router-redux';
import { withCookies } from 'react-cookie';
import { getTranslate } from 'react-localize-redux';

import { AccountBanner, Footer, ConfirmModal, PatientDailiesManager } from '../../components';
import { DoctorPatientsPanel } from '../../panels';

import * as Actions from '../../redux/actions';

import styles from './DoctorPage.scss';

@connect(
    (store) => ({
        translator: getTranslate(store.locale),
        account: store.account,
        doctor: store.doctor,
        request: store.request
    }),
    (dispatcher) => ({
        logoutRequest: (session) => (
            dispatcher(Actions.account.doctorLogoutRequest(session))
        ),
        setSession: (session, type) => (
            dispatcher(Actions.account.set(session, type))
        ),
        getAccountInformation: (session) => (
            dispatcher(Actions.doctor.accountInformationRequest(session))
        ),
        createPatient: (data) => (
            dispatcher(Actions.doctor.createPatient(data))
        ),
        getPatients: (session) => (
            dispatcher(Actions.doctor.getPatientsRequest(session))
        ),
        deletePatients: (session, usernames) => (
            dispatcher(Actions.doctor.deletePatientsRequest(session, usernames))
        ),
        push: (location) => (
            dispatcher(push(location))
        )
    })
)
@withCookies
class DoctorPage extends Component {

    constructor(props) {
        super(props);

        this.newPatientFormData = {};

        this.state = {
            showNewPatientModal: false,
            selectedPatientListItems: [],
            showDeletePatientsConfirmation: false
        }

        // Method bindings.
        this.authenticate = this.authenticate.bind(this);
        this.logout = this.logout.bind(this);
        this.checkSession = this.checkSession.bind(this);
        this.doctorFullName = this.doctorFullName.bind(this);

        this.showNewPatientModal = this.showNewPatientModal.bind(this);
        this.hideNewPatientModal = this.hideNewPatientModal.bind(this);
        this.hideDeletePatientsModal = this.hideDeletePatientsModal.bind(this);
        this.showDeletePatientsModal = this.showDeletePatientsModal.bind(this);

        this.deletePatients = this.deletePatients.bind(this);
    }

    componentWillMount() {
        this.checkSession();
    }

    componentDidMount() {
        // Get information if a session exists (which it should be if this component is mounted).
        if (this.props.account.session) {
            this.props.getAccountInformation(this.props.account.session).then((result) => {
                const { status } = result.value.data.payload;
                console.log(status);
            });
            this.props.getPatients(this.props.account.session);
        }
    }

    componentDidUpdate() {
        this.checkSession();
    }

    componentWillReceiveProps(nextProps) {
        const { status } = nextProps.doctor;
        if(this.props.doctor.status.type !== status.type) {
            if (status.type == 'success') {
                if(status.from == 'Doctor_Create_Patient/REQUEST_FULFILLED') {
                    this.hideNewPatientModal();
                }
            }
        }
    }

    checkSession() {
        if (this.props.account.session == null) {
            this.props.cookies.remove('session');
            this.props.cookies.remove('type');
            this.props.push('/');
        }
    }

    /**
     * Authenticates the access to this page.
     */
    authenticate() {
        const { session, type } = this.props.account;
        if (session != null && type === 'doctor') {
            return true;
        }
        return false;
    }

    logout() {
        this.props.logoutRequest(this.props.account.session);
        this.props.setSession(null, null);
    }

    createPatient(data) {
        this.props.createPatient({
            session: this.props.account.session,
            ...data
        }).then(() => {
            this.props.getPatients(this.props.account.session);
        });
    }

    renderRedirect() {
        return (
            <Redirect to={{
                pathname: '/',
                state: { from: this.props.location }
            }} />
        )
    }

    doctorFullName() {
        const { firstname, lastname } = this.props.doctor;
        if (firstname && lastname) {
            return 'Dr. ' + firstname + ' ' + lastname;
        }
        return '-';
    }

    showNewPatientModal() {
        this.setState({
            showNewPatientModal: true
        })
    }

    hideNewPatientModal() {
        this.setState({
            showNewPatientModal: false
        })
    }

    hideDeletePatientsModal() {
        this.setState({
            showDeletePatientsConfirmation: false
        });
    }

    showDeletePatientsModal() {
        this.setState({
            showDeletePatientsConfirmation: true
        });
    }

    deletePatients() {
        const patientUsernames = this.state.selectedPatientListItems.map((patient) => {
            return patient.username;
        })
        this.props.deletePatients(this.props.account.session, patientUsernames).then(
            (result) => {
                this.hideDeletePatientsModal();
                this.props.getPatients(this.props.account.session);
            },
            (error) => {
                this.hideDeletePatientsModal();
                this.props.getPatients(this.props.account.session);
            }
        );
        this.setState({
            selectedPatientListItems: []
        });
    }

    render() {

        const t = this.props.translator;

        if (!this.authenticate()) {
            return (this.renderRedirect());
        }

        const { firstname, lastname } = this.props.doctor;
        var patientFormTagPrefix = 'dxz';
        if(firstname && lastname) {
            patientFormTagPrefix = (
                'd' + 
                this.props.doctor.firstname.charAt(0) + 
                this.props.doctor.lastname.charAt(0)
             ).toLowerCase();
        }

        const errorCode = this.props.request.error.code || this.props.doctor.status.code;

        return (
            <div className={styles.container}>

                <AccountBanner
                    translator={this.props.translator}
                    accountName={this.doctorFullName()}
                    buttons={[
                        { title: this.props.translator("account.settings"), onClick: () => {} },
                        { title: this.props.translator("account.logout"), onClick: this.logout }
                    ]}
                />
                <DoctorPatientsPanel
                    translator={this.props.translator}
                    list={{
                        patients: this.props.doctor.patients,
                        onSelectItem: (selectedItems) => {
                            console.log("items change: ", selectedItems);
                            this.setState({
                                selectedPatientListItems: selectedItems
                            });
                        }
                    }}
                    patientForm={{
                        tag: patientFormTagPrefix,
                        onDataChange: (data) => {
                            this.newPatientFormData = data;
                        },
                        onSubmit: () => {
                            this.createPatient(this.newPatientFormData);
                        },
                        requestStatus: this.props.request.statusKey['create_patient'] === Actions.request.ENUM_STATUS.PENDING ? 'pending' : 'idle'
                    }}
                    onNewPatientClick={(show) => {
                        console.log('Clicked! ', show)
                        if(show) {
                            this.showNewPatientModal();
                        } else {
                            this.hideNewPatientModal();
                        }
                    }}
                    showNewPatientModal={this.state.showNewPatientModal}
                    errorNotification={errorCode}
                    enableDeleteButton={
                        this.state.selectedPatientListItems.length > 0
                    }
                    onDeleteButtonClick={()=> {
                        this.setState({
                            showDeletePatientsConfirmation: true
                        });
                    }}
                />
                <Footer translator={this.props.translator} />
                <ConfirmModal 
                    id="confirm-delete"
                    show={this.state.showDeletePatientsConfirmation}
                    confirmType="danger"
                    title={t('modal.title-delete-patients')}
                    confirmText={t('modal.delete')}
                    cancelText={t('modal.cancel')}

                    onConfirm={this.deletePatients}
                    onCancel={() => {
                        this.setState({
                            showDeletePatientsConfirmation: false
                        });
                    }}
                >
                    <p>{t('modal.body-delete-patients')}</p>
                    <p>{this.state.selectedPatientListItems.map((value, index) => {
                        return (
                            <div key={index}>
                                <span>{value.username}</span>
                                {value.nickname ? 
                                    <span>&nbsp;(<i>{value.nickname}</i>)</span> :
                                    false
                                }
                            </div>
                        )
                    })}</p>
                </ConfirmModal>
            </div>
        );
    }

}

export default DoctorPage;