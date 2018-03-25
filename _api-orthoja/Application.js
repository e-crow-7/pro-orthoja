// Express.js
import express from 'express';
// Express.js middleware.
import helmet from 'helmet'; // Protects against common header attacks.
import bodyParser from 'body-parser'; // Helps parse the body of HTTP messages.

import Ajv from 'ajv';

import { CommonError } from './library/error';
import { sleep } from './library/common';
import { DatabaseManager, OrthojaDatabase } from './library/database';
import { Logger } from './library/logger';
import { OrthojaRouter, SetupRoutes } from './library/routing';

// File system
import fileSystem, { readdir, readdirSync } from 'fs';

// Get the configuration details
const CONFIG = require('./configuration.json');

// Utilities.
const UTIL = require('util');

// Get the logger instance.
const LOG = Logger.get();

// Provides more information on unhandles promises.
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // application specific logging, throwing an error, or other logic here
});

/**
 * Main application for the Orthoja API service.
 * 
 * @class Application
 */
export default (function () {

    var _application = null;
    var _validator = {
        request: null,
        response: null
    }

    /**
     * Primary initialization function. Boots up the service.
     * @memberof Application
     * @access private
     */
    function _initialize() {
        // Create the application as an express application.
        _application = express();
        // This application trusts the proxy for ip addresses.
        // DISABLE IF OWNERSHIP OF THE REVERSE PROXY IS UNTRUSTED.
        // (Since the data can be easily spoofed).
        _application.enable('trust proxy');
        // Apply middleware to the application
        _application.use(helmet());
        _application.use(bodyParser.json());

        // Setup listeners.
        _application.post('/', _apiPostListener);
        _application.get('/', _apiGetListener);

        // First establish connection to the database.
        _initializeDatabaseServiceConnection(CONFIG.database.url, CONFIG.database.timeout).then(() => {
            LOG.info('Connected to Database Service: %s', CONFIG.database.url);

            // Add databases
            return Promise.all([DatabaseManager.add(OrthojaDatabase)]);
        }).then((databases) => {
            // Initialize schema.
            return _initializeSchema('./schema/requests/', './schema/responses/');
        }).then((requestValidator, responseValidator) => {
            _validator.request = requestValidator;
            _validator.response = responseValidator;

            LOG.info('Loaded validation schemas.');

            // Set the router to use the request validator.
            OrthojaRouter.setValidator(_validator.request);
            // Adds doctor routes to the Orthoja Router.
            SetupRoutes(OrthojaRouter);

            LOG.info('Loaded message routes.');

            _beginListening(CONFIG.application.port).then(() => {
                LOG.info("==========================================================================================");
                LOG.info(" ORTHOJA - API SERVICE");
                LOG.info(" Listening on port %d.", CONFIG.application.port);
                LOG.info("==========================================================================================");
            });
        },
            (error) => {
                LOG.error(error);
                return null;
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
            const attemptToConnect = function () {
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
     * Loads and creates the schema validators.
     * @memberof Application
     * @access private
     * @param {string} requestSchemaFolder Path to folder containing all request schema files.
     * @param {string} responseSchemaFolder Path to folder containing all response schema files.
     * @return {Promise<Validator, Validator>} Promises that the schema will load.
     */
    function _initializeSchema(requestSchemaFolder, responseSchemaFolder) {
        return new Promise((resolve, reject) => {
            try {
                // Define schema arrays.
                const requestSchemas = [];
                const responseSchemas = [];

                // Load response schemas
                fileSystem.readdirSync(requestSchemaFolder).forEach((item) => {
                    requestSchemas.push(
                        JSON.parse(
                            fileSystem.readFileSync(requestSchemaFolder + item)
                        )
                    );
                });

                // Load request schemas
                fileSystem.readdirSync(responseSchemaFolder).forEach((item) => {
                    responseSchemas.push(
                        JSON.parse(
                            fileSystem.readFileSync(responseSchemaFolder + item)
                        )
                    );
                });

                const requestAjv = new Ajv({ schemas: requestSchemas, allErrors: true });
                const responseAjv = new Ajv({ schemas: responseSchemas, allErrors: true });

                const requestValidator = requestAjv.getSchema('http://orthoja.com/requests/schema.json');
                const responseValidator = responseAjv.getSchema('http://orthoja.com/responses/schema.json');

                resolve(requestValidator, responseValidator);
            } catch (error) {
                reject(error);
            }
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
     * Reads API messages
     * @memberof Application
     * @access private
     * @param {Object} parcel The parcel object for API processing.
     * @return {Object} Returns a message.
     */
    function _readApiMessages(parcel, callback) {
        OrthojaRouter.route(parcel).then(callback);
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
        // Bundle up the parcel.
        const parcel = {
            ip: request.ip,
            message: body
        }

        // Send a response based on the request body.
        _readApiMessages({message: body}, (message) => {
            response.send(JSON.stringify(message));
        })

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