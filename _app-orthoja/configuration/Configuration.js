import { AsyncStorage } from "react-native";

// Configurations storage keys.
const APP_CONFIGURATION = 'APP/Configuration'

/**
 * Main Application configuration.
 */
export default class Configuration {

    static initialized = false;
    static default = require('./configuration.json');
    static configuration = null;

    /**
     * initalizes the singleton.
     * @param {?function} callback The callback funtion after the configuration initializes.
     */
    static initialize(callback=()=>{}) {
        console.log('CONFIGURATION DEFAULT:', this.configuration);

        this.configuration = {...this.default};

        // Fetch overriding configurations from the storage.
        this.load(() => {
            this.initialized = true;
            callback();
        });
    }

    /**
     * Loads in application configuration data.
     * @param {?function} callback The callback funtion after the data loads.
     */
    static load(callback=()=>{}) {
        // Fetch overriding configurations from the storage.
        AsyncStorage.getItem(APP_CONFIGURATION, (error, result) => {
            if(error!=null) {
                console.log('There was an error loading the application configuration data:', error);
            }
            console.log('Application configuration load results:', result);

            // Parse the loaded configuration.
            var newConfiguration = null;
            try {
                newConfiguration = JSON.parse(result);
            } catch(error) {
                console.log('SyntaxError parsing configuration JSON from storage:', error.message);
            }

            // Set the configuration object.
            this.configuration = {...this.configuration, ...newConfiguration} || this.configuration;

            callback();
        });
    }

    /**
     * Saves the application configuration data in storage. Overrides the defaults.
     * @param {?function} callback The callback funtion after the data saves.
     */
    static save(callback=()=>{}) {
        const stringifiedConfiguration = JSON.stringify(this.configuration);
        AsyncStorage.setItem(APP_CONFIGURATION, stringifiedConfiguration, (error) => {
            if(error!=null) {
                console.log('There was an error saving the application configuration data:', error);
            }
            callback();
        });
    }

    /**
     * Resets the application settings by removing the storage settings.
     * @param {?function} callback The callback funtion after the data resets.
     */
    static reset(callback=()=>{}) {
        this.configuration = {...this.default};
        callback();
    }

    /**
     * Gets the configuration object.
     */
    static get data() {
        return this.configuration;
    }

    /**
     * Gets the full host name of the server configurations.
     */
    static get fullhostname() {
        return(
            this.configuration.server.host + ':' + this.configuration.server.port.toString()
        );
    }

    /**
     * Edits a configuration by string
     */
    static edit(string, key, value) {

        var toEdit = this.configuration;
        if(string) {
            var toEdit = this.getObjectByString(this.configuration, string);
        }
        toEdit[key] = value;

    }

    static getObjectByString = function(object, string) {
        string = string.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        string = string.replace(/^\./, '');           // strip a leading dot
        var a = string.split('.');
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (k in object) {
                object = object[k];
            } else {
                return;
            }
        }
        return object;
    }

}