import { REQUEST_FULFILLED } from '../actions/requestActions';
import { ACCOUNT_INFORMATION, CREATE_PATIENT, GET_PATIENTS } from '../actions/doctorActions';

// ====================================================================================================
// INITIAL REDUCER STATE
// --------------------------------------------------------------------------------
const initialState = {
    firstname: null,
    lastname: null,
    username: null,
    email: null,
    patients: [],

    status: {
        from: null,
        type: null,
        code: null
    }
};

// ====================================================================================================
// ACTION FUNCTIONS
// --------------------------------------------------------------------------------
function setInformation(state, action) {

    const { information, status } = action.payload;

    if(status.type === 'success') {

        return({
            ...state,
            firstname: information.firstname || null,
            lastname: information.lastname || null,
            username: information.username || null,
            email: information.email || null
        })
    } else {
        return state;
    }
}

function setPatientCreateStatus(state, action) {

    const { type, code } = action.payload;

    if(type) {

        return({
            ...state,
            status: {
                from: action.type,
                type: type,
                code: code
            }
        })

    } else {
        return state;
    }
}

function getPatients(state, action) {

    const { patients, status } = action.payload;

    if(patients) {

        return({
            ...state,
            patients: patients
        })

    } else {
        return state;
    }
}
// ====================================================================================================
// REDUCER
// --------------------------------------------------------------------------------
export default (state = initialState, action) => {

    console.log(action.type);

    switch (action.type) {

        case `${ACCOUNT_INFORMATION}/${REQUEST_FULFILLED}`:
            return setInformation(state, action);

        case `${CREATE_PATIENT}/${REQUEST_FULFILLED}`:
            return setPatientCreateStatus(state, action);

        case `${GET_PATIENTS}/${REQUEST_FULFILLED}`:
            return getPatients(state, action);
        
        default:
            if (state.status.from || state.status.type) {
                return { ...state, status: { from: null, type: null, code: null } };
            }
            break;

    }

    return state;

}
