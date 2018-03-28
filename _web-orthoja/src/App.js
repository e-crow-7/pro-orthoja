import React, { Component } from 'react';
import { Provider } from 'react-redux';

import './styles/bootstrap.main.css';
import styles from './App.scss';

import { store, history } from './redux';
import { initializeLocale } from "./locale";
import { LoginPage, DoctorPage, NotFoundPage } from './pages';

import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';

// Set languages.
initializeLocale();

class App extends Component {
    render() {

        return (
            <Provider store={store}>
                <ConnectedRouter history={history}>
                    <div className={styles.app}>
                        <Switch>
                            <Route exact path="/" component={LoginPage} />
                            <Route exact path="/doctor" component={DoctorPage} />
                            <Route component={NotFoundPage} />
                        </Switch>
                    </div>
                </ConnectedRouter>
            </Provider>
        );
    }
}

export default App;
