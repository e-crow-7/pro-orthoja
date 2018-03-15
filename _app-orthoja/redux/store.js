/**
 * @description Redux store for the application.
 *
 * @author Eric Crowell
 * @version 0.0.0
 */

// ====================================================================================================
// IMPORTS
// --------------------------------------------------------------------------------
// Redux
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { logger } from 'redux-logger';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
// Reducers
import { localeReducer } from 'react-localize-redux';
import { userReducer } from './reducers/userReducer.js';
import Navigator from '../navigation/Navigation';
import { batchReducer } from './reducers/batchReducer';
import { dailiesReducer } from './reducers/dailiesReducer';
// Middleware
import { batchMiddleware } from './middeware/batchMiddleware';

// React Native Debugger (To allow Redux)
import { composeWithDevTools } from 'redux-devtools-extension';

// ====================================================================================================
// REDUCER CONFIGURATION
// --------------------------------------------------------------------------------
// Combine
const reducers = combineReducers({
	'batch': batchReducer,
	'user': userReducer,
	'locale': localeReducer,
	'navigation': Navigator.getRootReducer(),
	'dailies': dailiesReducer,
});

// ====================================================================================================
// MIDDLEWARE CONFIGURATION
// --------------------------------------------------------------------------------
const middleware = applyMiddleware(promiseMiddleware(), batchMiddleware, thunk);

// ====================================================================================================
// STORE CONFIGURATION
// --------------------------------------------------------------------------------
const store = createStore(reducers, composeWithDevTools(middleware));
export default store;
