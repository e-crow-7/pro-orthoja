import * as requestActions from './requestActions';

export const ACCOUNT_INFORMATION = 'Doctor_Account_Information';
export const CREATE_PATIENT = 'Doctor_Create_Patient';
export const GET_PATIENTS = 'Doctor_Get_Patients';
export const DELETE_PATIENTS = 'Doctor_Delete_Patients';
export const GET_PATIENT_DAILIES = 'Doctor_Get_Patient_Dailies';
export const CREATE_PATIENT_DAILY = 'Doctor_Create_Patient_Daily';

/**
 * Redux action to request account information for the doctor account.
 * @param {string} session Session ID provided by the service.
 * @return {Object} The dispatcher object.
 */
export function accountInformationRequest(session) {
    // Batch a single user request.
    const request = {
        type: ACCOUNT_INFORMATION,
        form: 'REQUEST',
        payload: {
            session: session
        }
    }

    return requestActions.sendRequest(request, 'account_information');
}

export function createPatient(data) {

    const payload = {
        session: data.session,
        username: data.username,
        password: data.password
    }

    if(data.nickname) { payload["nickname"] = data.nickname; }
    if(data.birthdate) { payload["birthdate"] = data.birthdate; }
    if(data.sex) { payload["sex"] = data.sex; }
    if(data.race) { payload["race"] = data.race; }
    if(data.country) { payload["country"] = data.country; }
    if(data.region) { payload["region"] = data.region; }

    // Batch a single user request.
    const request = {
        type: CREATE_PATIENT,
        form: 'REQUEST',
        payload: payload
    }

    return requestActions.sendRequest(request, 'create_patient');
}

export function getPatientsRequest(session) {
    // Batch a single user request.
    const request = {
        type: GET_PATIENTS,
        form: 'REQUEST',
        payload: {
            session: session
        }
    }

    return requestActions.sendRequest(request, 'get_patients');
}

export function deletePatientsRequest(session, patientUsernames) {
    // Batch a single user request.
    const request = {
        type: DELETE_PATIENTS,
        form: 'REQUEST',
        payload: {
            session: session,
            usernames: patientUsernames
        }
    }

    return requestActions.sendRequest(request, 'delete_patients');
}

export function getPatientDailiesRequest(session, patientUsername) {
    // Batch a single user request.
    const request = {
        type: GET_PATIENT_DAILIES,
        form: 'REQUEST',
        payload: {
            session: session,
            username: patientUsername
        }
    }

    return requestActions.sendRequest(request, 'get_patient_dailies');
}

export function createPatientDailyRequest(session, patientUsername, daily) {

    // Batch a single user request.
    const request = {
        type: CREATE_PATIENT_DAILY,
        form: 'REQUEST',
        payload: {
            session: session,
            username: patientUsername,
            daily: daily
        }
    }

    return requestActions.sendRequest(request, 'create_patient_daily');
}