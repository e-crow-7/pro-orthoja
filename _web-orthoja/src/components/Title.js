import React, { Component } from 'react';
import { PropTypes } from "prop-types";

import styles from './Title.scss';

class Title extends Component {

    static propTypes = {
        text: PropTypes.string
    }

    static defaultProps = {
        text: 'Title'
    }

    render() {
        return(
            <div className={styles.container}>
                {this.props.text}
            </div>
        )
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default Title;