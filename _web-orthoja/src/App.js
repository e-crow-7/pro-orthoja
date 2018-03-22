import React, { Component } from 'react';
import { Provider } from 'react-redux';

import './styles/bootstrap.main.css';
import styles from './App.scss';

import { store } from './redux';
import { initializeLocale } from "./locale";
import { LoginPage } from './pages';

// Set languages.
initializeLocale();

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <div className={styles.app}>
                    <LoginPage />
                </div>
            </Provider>
        );
    }
}

export default App;
