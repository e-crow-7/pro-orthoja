import Handler from './Handler';
import { DatabaseManager, OrthojaDatabase } from '../database';
import { DoctorResponses } from "../messages";

import { hashPasswordSync } from '../common';

/**
 * Class for handling patient creation requests.
 * @memberof module:Handler
 */
class PatientCreateHandler extends Handler {

    response(payload) {
        return ({
            type: 'Patient_Create',
            form: 'RESPONSE',
            payload: payload
        })
    }

    document(parcel) {

        // Declare return document object.
        var document = {};
        // Extract payload data.
        // (Message Requirement), (Database Requirement).
        const { 
            username, // Required, Required
            password, // Required, Required
            nickname, // Optional, Optional
            birthdate, // Optional, Optional
            sex, // Optional, Optional
            race, // Optional, Optional
            country, // Optional, Optional
            region, // Optional, Optional
        } = parcel.message.payload;

        // Most required fields in both the message and database can be directly thrown in.
        document = {...document, username};

        // Password needs to be hased before insertion.
        document["password"] = hashPasswordSync(password);

        // Check optional fields that are required by the database.
        if(nickname) { document["nickname"] = nickname }
        if(birthdate) { document["birthdate"] = birthdate }
        if(sex) { document["sex"] = sex }
        if(race) { document["race"] = race }
        if(country) { document["country"] = country }
        if(region) { document["region"] = region }

        // Created date stamp
        document["createdDate"] = new Date().toISOString();

        // Return the database document (hopefully valid).
        return(document);
    }

    /**
     * 
     * @param {Parcel} parcel The object containing 
     */
    process(parcel) {
        return new Promise((resolve) => {
            const orthojaDatabase = DatabaseManager.get(OrthojaDatabase.name);
            const patientCollection = orthojaDatabase.collection('patients');

            patientCollection.createDocument(this.document(parcel)).then(
                () => {
                    resolve(
                        this.response({ type: 'success' })
                    );
                },
                () => {
                    resolve(
                        this.response({ type: 'fail', code: 'account.create' })
                    );
                }
            );
        });
    }

    /**
     * Handles the given parcel data and returns a response message.
     * @param {Object} parcel The object containing details of the recieved request package.
     * @return {Promise<message>} Resolve: message object.
     */
    handle(parcel) {
        return new Promise((resolve) => {

            // Resolve this promise when the resolve of the process promise.
            this.process(parcel).then(resolve);

        });
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default PatientCreateHandler;