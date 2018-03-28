import { DOCTOR_LOGIN } from '../actions/accountActions';
import { REQUEST } from '../actions/requestActions';
import { FULFILLED } from 'redux-promise-middleware';

// ====================================================================================================
// INITIAL REDUCER STATE
// --------------------------------------------------------------------------------
const initialState = {
    session: null,
    type: null, // 'doctor' or 'patient'
    error: {
        code: null
    }
};

// ====================================================================================================
// ACTION FUNCTIONS
// --------------------------------------------------------------------------------
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

        case `${DOCTOR_LOGIN}/${REQUEST}_${FULFILLED}`:
            return loginDoctor(state, action);

        default:
            if (state.error.code) {
                return { ...state, error: { code: null } };
            }
    }

    return state;

}
