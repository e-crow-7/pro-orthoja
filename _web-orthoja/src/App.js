import React, { Component } from 'react';

import './styles/bootstrap.main.css';
import styles from './App.scss';

import { LoginPage, DoctorPage, NotFoundPage } from './pages';
import { Route, Switch } from 'react-router';



class App extends Component {

    render() {
        return (
            <div className={styles.app}>
                <Switch>
                    <Route exact path="/" component={LoginPage} />
                    <Route exact path="/doctor" component={DoctorPage} />
                    <Route component={NotFoundPage} />
                </Switch>
            </div>
        );
    }
}

export default App;
