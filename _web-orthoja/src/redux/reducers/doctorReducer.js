import { REQUEST_FULFILLED } from '../actions/requestActions';
import { ACCOUNT_INFORMATION } from '../actions/doctorActions';

// ====================================================================================================
// INITIAL REDUCER STATE
// --------------------------------------------------------------------------------
const initialState = {
    firstname: null,
    lastname: null,
    username: null,
    email: null,
    patients: []
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
// ====================================================================================================
// REDUCER
// --------------------------------------------------------------------------------
export default (state = initialState, action) => {

    console.log(action.type);

    switch (action.type) {

        case `${ACCOUNT_INFORMATION}/${REQUEST_FULFILLED}`:
            return setInformation(state, action);

    }

    return state;

}
