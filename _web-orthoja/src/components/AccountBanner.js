import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './AccountBanner.scss';

class AccountBanner extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        accountName: PropTypes.string,
        buttons: PropTypes.array
    }

    static defaultProps = {
        accountName: 'Untitled',
        buttons: []
    }

    ButtonElement({title, onClick, ...props}) {
        return(
            <button onClick={onClick} {...props}>
                {title}
            </button>
        )
    }

    render() {

        const buttonElements = this.props.buttons.map((value, index) => {
            return (<this.ButtonElement {...value} key={index} />);
        });

        return(
            <div className={styles.container}>
                <div className={styles.topBar}>
                    <div>
                        <span style={{fontSize: '0.8em'}}>{this.props.translator('common.welcome')}</span>&nbsp;
                    </div>
                    <div className={styles.buttonList}>{buttonElements}</div>
                </div>
                <div className={styles.mainBar}>
                    <h2>{this.props.accountName}</h2>
                </div>
            </div>
        )
    }
}

export default AccountBanner;