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
    DoctorAccountInformationHandler: require('./DoctorAccountInformationHandler').default
}