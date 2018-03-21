import React, { Component } from 'react';

import { Title, LoginForm } from "../components";

class LoginPage extends Component {

    render() {
        return(
            <div>
                <Title text={'Orthoja'} />
                <LoginForm />
            </div>
        )
    }

}

export default LoginPage;