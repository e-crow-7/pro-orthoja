import { createStore, applyMiddleware, combineReducers } from 'redux';

// Middleware
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import * as Middleware from './middleware';

// Reducers
import { localeReducer } from 'react-localize-redux';
import * as Reducers from './reducers';

// Composers
import { composeWithDevTools } from 'redux-devtools-extension';

// Apply middleware
var middleware = applyMiddleware(
    promiseMiddleware(),
    thunkMiddleware,
    Middleware.batch
);

// Combine Reducers
const reducers = combineReducers({
    "batch": Reducers.batch,
    "locale": localeReducer
});

// Compose with redux development tools if building in development.
if(process.env.NODE_ENV === 'development') {
    middleware = composeWithDevTools(middleware);
}

// Create store.
export default createStore(reducers, middleware);
