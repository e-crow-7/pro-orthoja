// Application configuration.
import { Configuration } from "../../configuration";
import axios from 'axios';

// Dispatch Types
export const BATCH_REQUEST = 'Batch/REQUEST';

export const ENUM_STATUS = {
    IDLE: 0,
    PENDING: 1,
    FULFILLED: 2,
    REJECTED: 3
}

// Action functions
/**
 * Sends a batch request.
 * @param {array} requests Array of requests to send to the server.
 */
export function sendBatchRequests(requests) {

    console.log('CONFIGURATION DATA...', Configuration.data);

    // Ensure the requests is an array.
    if(!Array.isArray(requests)) {
        console.log('Batched requests not an array type.');
        return;
    }

    // Batch a single user request.
    const requestBody = {
        type: 'Batch/REQUEST',
        requests: requests
    };

    return ({
        type: BATCH_REQUEST,
        payload: axios({
            method: 'post',
            url: Configuration.fullhostname,
            data: requestBody,
            timeout: Configuration.data.server.timeout
        })
    });
}