import React, { Component } from 'react';

import './styles/bootstrap.main.css';
import styles from './App.scss';

import { LoginPage } from "./pages";

class App extends Component {
    render() {
        return (
            <div className={styles.app}>
                <LoginPage />
            </div>
        );
    }
}

export default App;
