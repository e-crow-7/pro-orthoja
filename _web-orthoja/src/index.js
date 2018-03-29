import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { store, history } from './redux';

import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { CookiesProvider } from 'react-cookie';

import { initializeLocale } from "./locale";
initializeLocale();

function Root() {
    return (
        <Provider store={store}>
            <CookiesProvider>
                <ConnectedRouter history={history}>
                    <App />
                </ConnectedRouter>
            </CookiesProvider>
        </Provider>
    );
}

ReactDOM.render(
    Root(), document.getElementById('root')
);

registerServiceWorker();
