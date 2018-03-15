/**
 * @description Redux reducer for handling User data.
 *
 * @author Eric Crowell
 * @version 0.0.0
 */
import { USER_LOGIN, USER_LOGOUT, USER_SESSION_SAVE } from '../actions/userActions';
 
// ====================================================================================================
// INITIAL REDUCER STATE
// --------------------------------------------------------------------------------
const initialState = {
	id: null,
	username: null,
	error: {
		code: 0
	}
};

// ====================================================================================================
// ACTION FUNCTIONS
// --------------------------------------------------------------------------------

function userLoginResponse(state, action) {

	const id = action.payload.userId || null;
	const username = action.payload.username || null;

	return {
		...state,
		id: id,
		username: username,
		error: {
			code: (id === null ? 2001 : 0)
		}
	}
}

function userLogout(state, action) {
	if(!state.id) {
		return(state);
	}

	return({
		...state,
		id: null,
		username: null
	})
}

// ====================================================================================================
// USER REDUCER
// --------------------------------------------------------------------------------
export const userReducer = (state = initialState, action) => {

	switch (action.type) {

		case `${USER_LOGIN}_RESPONSE`:
			return userLoginResponse(state, action);
			break;

		case `${USER_LOGOUT}`:
			return userLogout(state, action);
			break;

		default:
			if(state.error.code !== 0) {
				return {...state, error: { code: 0 }};
			}
			break;

	}

	return state;

}
