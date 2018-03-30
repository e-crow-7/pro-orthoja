import * as requestActions from './requestActions';

export const ACCOUNT_INFORMATION = 'Doctor_Account_Information';

/**
 * Redux action to request a Doctor Account Login.
 * @param {string} username Account username.
 * @param {string} password Account password.
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