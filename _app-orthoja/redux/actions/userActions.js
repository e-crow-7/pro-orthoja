import { AsyncStorage } from 'react-native';
import axios from 'axios';

import { sendBatchRequests } from './batchActions.js'

// Dispatch Types
export const USER_LOGIN = 'User/LOGIN';
export const USER_LOGOUT = 'User/LOGOUT';
export const USER_SESSION_SAVE = 'User/SAVE_SESSION';

// Storage Types
export const DEVICEDB = {
    USER_NAME: '@UserName',
    USER_SESSION: '@UserSession'
};

// Action functions
export function userLogin(username, password) {

    // Batch a single user request.
    const requests = [
        {
            type: USER_LOGIN,
            payload: {
                username: username,
                password: password
            }
        }
    ];

    return sendBatchRequests(requests);
}

// Action functions
export function userLogout() {

    return ({
        type: USER_LOGOUT
    });

}

export function userSaveSessionInformation(sessionId, username) {

    console.log('USERNAME: ', username);
    console.log('SESSIONID: ', sessionId);

    return({
        type: USER_SESSION_SAVE,
        payload: AsyncStorage.multiSet([
            [DEVICEDB.USER_SESSION, sessionId],
            [DEVICEDB.USER_NAME, username]
        ])
    });

}