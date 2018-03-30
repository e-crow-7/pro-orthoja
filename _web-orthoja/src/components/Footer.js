import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import styles from './Footer.scss';

class Footer extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired
    }

    render() {

        const currentYear = new Date().getFullYear();

        return (
            <div className={styles.container}>
                <span>Orthoja.com &copy;</span>
                <span>{currentYear}&nbsp;|&nbsp;</span>
                <span>{this.props.translator('footer.author')}&nbsp;(eCrow Ltd.)&nbsp;|&nbsp;</span>
                <span>{this.props.translator('footer.contact')}</span>
            </div>
        )
    }

}

// ================================================================================
// Exports
// ------------------------------------------------------------
export default Footer;