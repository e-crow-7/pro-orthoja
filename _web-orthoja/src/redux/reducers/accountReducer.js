import { DOCTOR_LOGIN, ACCOUNT_SET } from '../actions/accountActions';
import { REQUEST } from '../actions/requestActions';
import { FULFILLED } from 'redux-promise-middleware';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

// ====================================================================================================
// INITIAL REDUCER STATE
// --------------------------------------------------------------------------------
const initialState = {
    session: cookies.get('session'),
    type: cookies.get('type'), // 'doctor' or 'patient'
    error: {
        code: null
    }
};

// ====================================================================================================
// ACTION FUNCTIONS
// --------------------------------------------------------------------------------
function set(state, action) {

    // Extract payload data.
    const { session, type } = action.payload

    return {
        ...state,
        session: session,
        type: type
    };
}

function loginDoctor(state, action) {

    // Extract payload data.
    const { session, type, code } = action.payload

    return {
        ...state,
        session: session || null,
        type: type === 'success' ? 'doctor' : null,
        error: {
            code: code || null
        }
    };
}

// ====================================================================================================
// REDUCER
// --------------------------------------------------------------------------------
export default (state = initialState, action) => {

    switch (action.type) {

        case `${ACCOUNT_SET}`:
            return set(state, action);

        case `${DOCTOR_LOGIN}/${REQUEST}_${FULFILLED}`:
            return loginDoctor(state, action);

        default:
            if (state.error.code) {
                return { ...state, error: { code: null } };
            }
    }

    return state;

}
