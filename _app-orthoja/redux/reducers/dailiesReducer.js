/**
 * @description Redux reducer for handling User data.
 *
 * @author Eric Crowell
 * @version 0.0.0
 */
import { DAILIES_FETCH_ALL, DAILIES_CHANGE_DATE, DAILIES_UPDATE_DATA } from "../actions/dailiesActions";

// ====================================================================================================
// INITIAL REDUCER STATE
// --------------------------------------------------------------------------------
const initialState = {
    current: new Date().toISOString().substr(0, 10), // Pointer to the current daily 
    data: null // Full data object of the dailies.
};

// ====================================================================================================
// ACTION TYPES
// --------------------------------------------------------------------------------
// None yet

// ====================================================================================================
// ACTION FUNCTIONS
// --------------------------------------------------------------------------------

/**
 * Populates the dailies data.
 * @param {object} state The previous redux state.
 * @param {object} action The redux action object.
 */
function dailiesReducerFunction(state, action) {
    // Get the array of dailies from the payload.
    const dailiesArray = action.payload.dailies;

    // popluate the dailies data.
    return({
        ...state,
        data: dailiesArray,
        error: {
            code: 0,
        }
    })
}

/**
 * Populates the dailies data.
 * @param {object} state The previous redux state.
 * @param {object} action The redux action object.
 */
function dailiesChangeDate(state, action) {
    // Get the array of dailies from the payload.
    const dateString = action.payload.dateString;

    // popluate the dailies data.
    return({
        ...state,
        current: dateString
    })
}

/**
 * The response from the server after asking to update a daily's data.
 * @param {object} state The previous redux state.
 * @param {object} action The redux action object.
 */
function dailiesUpdateDataResponse(state, action) {

    const { successful, id, data } = action.payload;

    if(successful) {
        // Get a new copy of the dailies array.
        const newDailies = state.data.slice();
        // Find the daily index with the provided id.
        const dailyIndex = newDailies.map((value) => { return value._id }).indexOf(id);

        newDailies[dailyIndex].data = { ...newDailies[dailyIndex].data, ...data };

        return({
            ...state,
            data: newDailies
        });
    }

    return({
        ...state,
        error: {
            code: successful ? 0 : 3001
        }
    });
}

// ====================================================================================================
// USER REDUCER
// --------------------------------------------------------------------------------
export const dailiesReducer = (state = initialState, action) => {

    switch (action.type) {

		case `${DAILIES_FETCH_ALL}_RESPONSE`:
            return dailiesReducerFunction(state, action);
        case `${DAILIES_CHANGE_DATE}`:
            return dailiesChangeDate(state, action);
        case `${DAILIES_UPDATE_DATA}_RESPONSE`:
            return dailiesUpdateDataResponse(state, action);
        default:
            return ({...state, error: { code: 0 }})

    }

    return state;

}
