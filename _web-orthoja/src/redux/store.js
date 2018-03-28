import { createStore, applyMiddleware, combineReducers } from 'redux';

// Packages
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

// Middleware
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import * as Middleware from './middleware';

// Reducers
import { localeReducer } from 'react-localize-redux';
import * as Reducers from './reducers';

// Composers
import { composeWithDevTools } from 'redux-devtools-extension';

// Router history
export const history = createHistory();

// Apply middleware
var middleware = applyMiddleware(
    routerMiddleware(history),
    promiseMiddleware(),
    thunkMiddleware,
    Middleware.request
);

// Combine Reducers
const reducers = combineReducers({
    "request": Reducers.request,
    "account": Reducers.account,
    "locale": localeReducer,
    "router": routerReducer
});

// Compose with redux development tools if building in development.
if(process.env.NODE_ENV === 'development') {
    middleware = composeWithDevTools(middleware);
}

// Create store.
export default createStore(reducers, middleware);
