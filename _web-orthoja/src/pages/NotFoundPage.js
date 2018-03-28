import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getTranslate } from 'react-localize-redux';

@connect(
    (store) => ({
        translator: getTranslate(store.locale),
    })
)
class NotFoundPage extends Component {

    render() {
        return (
            <div style={{color:'#fff', padding:'50px'}}>
                <h1 style={{fontSize:'5em'}}>404</h1>
                <p>{this.props.translator('error.page.find')}</p>
            </div>
        );
    }

}

export default NotFoundPage;