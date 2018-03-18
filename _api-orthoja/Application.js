// Express.js
import express from 'express';
// Express.js middleware.
import helmet from 'helmet'; // Protects against common header attacks.
import bodyParser from 'body-parser'; // Parses json objects out of HTTP messages

import { CommonError } from './library/error';
import { sleep } from './library/common';
import DatabaseManager from './library/database/DatabaseManager';
import { Logger } from './library/logger';
import { request } from 'https';

// Get the configuration details
const CONFIG = require('./configuration.json');

// Get the logger instance.
const LOG = Logger.get();

/**
 * Main application for the Orthoja API service.
 * 
 * @class Application
 */
export default (function () {

    var _application = null;

    /**
     * Primary initialization function. Boots up the service.
     */
    function _initialize() {
        // Create the application as an express application.
        _application = express();
        // Apply middleware to the application
        _application.use(helmet());
        _application.use(bodyParser.json());

        // Setup listeners.
        _application.post('/', _apiListener);

        // First establish connection to the database.
        _initializeDatabaseServiceConnection(CONFIG.database.url, CONFIG.database.timeout).then(() => {
            return _beginListening(CONFIG.application.port);
        }).then(() => {
            LOG.info("==========================================================================================");
            LOG.info(" ORTHOJA - API SERVICE");
            LOG.info(" Listening on port %d.", CONFIG.application.port);
            LOG.info("==========================================================================================");
        });
    }

    /**
     * initializeDatabaseServiceConnection
     * @param {string} url The url for the database connection.
     * @param {number} timeout Amount of time, in milliseconds, to reconnect to the database upon connection failure.
     * @return {Promise} Promises that the database will connect.
     */
    function _initializeDatabaseServiceConnection(url, timeout) {
        return new Promise((resolve, reject) => {
            const attemptToConnect = function() {
                DatabaseManager.connect(url).then(
                    resolve,
                    // Upon Error, attempt to 
                    (error) => {
                        LOG.error(error);
                        // Continue to attempt to connect again.
                        LOG.info('Attemping to database again in %d milliseconds', timeout);
                        sleep(timeout).then(attemptToConnect);
                    }
                );
            }
            attemptToConnect();
        });
    }

    /**
     * Begin listening for restful requests.
     * @param {number} port The port number for the application to listen to.
     * @return {Promise} Promises to begin listening.
     */
    function _beginListening(port) {
        return new Promise((resolve) => {
            _application.listen(port, resolve);
        });
    }

    /**
     * The primary API listener for Express.js.
     * @param {Object} request The requesting HTTP message.
     * @param {Object} response The response object.
     */
    function _apiListener(request, response) {

    }

    return ({
        /**
         * Starts up the application.
         * @function start
         * @memberof Application
         */
        start: function () {
            // Run the initialization.
            _initialize();
        }
    })

})();

/**
 * @typedef {ApplicationError}
 */
class ApplicationError extends CommonError {
    constructor(...parameters) {
        super(...parameters);
        this.name = ApplicationError.name;
    }
}