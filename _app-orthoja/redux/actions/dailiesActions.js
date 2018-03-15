import { sendBatchRequests } from "./batchActions";

export const DAILIES_CHANGE_DATE = 'Daily/CHANGE_DATE'
export const DAILIES_FETCH_ALL = 'Daily/FETCH_ALL';
export const DAILIES_UPDATE_DATA = 'Daily/UPDATE_DATA';

// Action functions

export function changeDate(dateString) {
    console.log('DATE CHANGE ACTION:', dateString);
    return ({
        type: DAILIES_CHANGE_DATE,
        payload: {
            dateString: dateString
        }
    });
}

export function fetchDailies(userId) {

    // Batch a single user request.
    const requests = [
        {
            type: DAILIES_FETCH_ALL,
            payload: {
                patientId: userId
            }
        }
    ];

    return sendBatchRequests(requests);
}

export function updateDailyData(dailyId, dateString, data) {
    var dataUpdate = {};
    dataUpdate[dateString] = data

    // Batch a single user request.
    const requests = [
        {
            type: DAILIES_UPDATE_DATA,
            payload: {
                dailyId: dailyId,
                data: dataUpdate
            }
        }
    ];

    return sendBatchRequests(requests);
}