/**
 * Classes and functions for handling requests sent the this API. Each handler inherits from
 * the CommonHandler class, which specifies the common interface.
 * @module Handler
 */

module.exports = {
    Handler: require('./Handler').default,
    BatchHandler: require('./BatchHandler').default,
    DoctorLoginHandler: require('./DoctorLoginHandler').default
}