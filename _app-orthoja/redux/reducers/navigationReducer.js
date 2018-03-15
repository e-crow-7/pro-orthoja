/**
 * @description Redux reducer for navigational routing.
 *
 * @author Eric Crowell
 * @version 0.0.0
 */

import { NavigationActions } from 'react-navigation';
import { createRootNavigator } from '../../navigation/Navigation';

const Navigator = createRootNavigator();
// ====================================================================================================
// INITIAL REDUCER STATE
// --------------------------------------------------------------------------------
const initialState = Navigator.router.getStateForAction(NavigationActions.init());

// ====================================================================================================
// ACTION TYPES
// --------------------------------------------------------------------------------

// ====================================================================================================
// USER REDUCER
// --------------------------------------------------------------------------------
export const navigationReducer = (state = initialState, action) => {

	const nextState = Navigator.router.getStateForAction(action, state);
	return nextState || state;

}
