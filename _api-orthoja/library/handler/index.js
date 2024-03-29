/**
 * Classes and functions for handling requests sent the this API. Each handler inherits from
 * the CommonHandler class, which specifies the common interface.
 * @module Handler
 */

module.exports = {
    Handler: require('./Handler').default,
    BatchHandler: require('./BatchHandler').default,

    DoctorCreateHandler: require('./DoctorCreateHandler').default,
    DoctorLoginHandler: require('./DoctorLoginHandler').default,
    DoctorLogoutHandler: require('./DoctorLogoutHandler').default,
    DoctorAccountInformationHandler: require('./DoctorAccountInformationHandler').default,
    DoctorCreatePatientHandler: require('./DoctorCreatePatientHandler').default,
    DoctorGetPatientsHandler: require('./DoctorGetPatientsHandler').default,
    DoctorDeletePatientsHandler: require('./DoctorDeletePatientsHandler').default,
    DoctorGetPatientDailiesHandler: require('./DoctorGetPatientDailiesHandler').default,
    DoctorCreatePatientDailyHandler: require('./DoctorCreatePatientDailyHandler').default,
    DoctorGetPatientDailyInputsHandler: require('./DoctorGetPatientDailyInputsHandler').default,
    DoctorCreatePatientDailyInputHandler: require('./DoctorCreatePatientDailyInputHandler').default,

    PatientCreateHandler: require('./PatientCreateHandler').default
}