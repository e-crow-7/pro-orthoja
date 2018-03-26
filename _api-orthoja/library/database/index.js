/**
 * The Database module contains classes and methods related interfacing with a databases
 * specific to the Orthoja Project.
 * @module Database
 */

module.exports = {
    DatabaseManager: require('./DatabaseManager').default,
    OrthojaDatabase: require('./orthoja/OrthojaDatabase').default
}