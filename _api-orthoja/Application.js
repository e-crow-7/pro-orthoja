// Express.js
import express from 'express';
// Express.js middleware.
import helmet from 'helmet'; // Protects against common header attacks.
import bodyParser from 'body-parser'; // Helps parse the body of HTTP messages.

import { CommonError } from './library/error';
import { sleep } from './library/common';
import { DatabaseManager } from './library/database';
import { Logger } from './library/logger';

// File system
import fileSystem from 'fs';

// Get the configuration details
const CONFIG = require('./configuration.json');

// Utilities.
const UTIL = require('util');

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
     * @memberof Application
     * @access private
     */
    function _initialize() {
        // Create the application as an express application.
        _application = express();
        // Apply middleware to the application
        _application.use(helmet());
        _application.use(bodyParser.json());

        // Setup listeners.
        _application.post('/', _apiPostListener);
        _application.get('/', _apiGetListener);

        // First establish connection to the database.
        _initializeDatabaseServiceConnection(CONFIG.database.url, CONFIG.database.timeout).then(() => {
            LOG.info('Connected to Database Service: %s', CONFIG.database.url);

            return _beginListening(CONFIG.application.port);
        }).then(() => {
            LOG.info("==========================================================================================");
            LOG.info(" ORTHOJA - API SERVICE");
            LOG.info(" Listening on port %d.", CONFIG.application.port);
            LOG.info("==========================================================================================");
        });
    }

    /**
     * Establishes connetion to the Database Service.
     * @memberof Application
     * @access private
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
     * @memberof Application
     * @access private
     * @param {number} port The port number for the application to listen to.
     * @return {Promise} Promises to begin listening.
     */
    function _beginListening(port) {
        return new Promise((resolve) => {
            _application.listen(port, resolve);
        });
    }

    /**
     * The primary API listener for Express.js (POST Requests).
     * @memberof Application
     * @access private
     * @param {Object} request The requesting HTTP message.
     * @param {Object} response The response object.
     */
    function _apiPostListener(request, response) {
        
        // Extract the head and body portions from the request.
        const { headers, body } = request;
        LOG.info('Received request with HEADERS: %o', headers);

        response.send(JSON.stringify({message: 'received'}));

    }

    /**
     * The primary API listener for Express.js (GET Requests).
     * @memberof Application
     * @access private
     * @param {Object} request The requesting HTTP message.
     * @param {Object} response The response object.
     */
    function _apiGetListener(request, response) {

        // There's nothing to be done for GET requests. Simply send an HTML response.
        response.send('<html><body><p>Orthoja API</p></body></html>');

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