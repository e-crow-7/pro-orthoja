import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import styles from './PatientDailiesList.scss';

class PatientDialiesList extends Component {

    static propTypes = {
        dailies: PropTypes.array,
        onSelectItem: PropTypes.func,
        onDailyClick: PropTypes.func
    }

    static defaultProps = {
        dailies: [],
        onSelectItem: () => { },
        onDailyClick: () => { }
    }

    constructor(props) {
        super(props);

        // Method bindings
        this.itemElement = this.itemElement.bind(this);
    }

    itemElement({ daily, ...props }) {
        return (
            <tr>
                <td>
                    <FontAwesome name="circle" style={{ color: '#d7d7d7' }} />
                </td>
                <td className={styles.columnAlignLeft + ' ' + styles.columnClickable}>
                    {daily.name}
                </td>
                <td className={styles.columnAlignLeft}>
                    {daily.type}
                </td>
            </tr>
        );
    }

    render() {

        const dailyItems = this.props.dailies.map((daily, index) => {
            return (
                <this.itemElement daily={daily} key={index} />
            );
        });

        return (
            <div>
                <Table striped bordered condensed hover className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <td style={{ width: '28px' }} onClick={this.selectAll}>
                                <FontAwesome name="circle" style={{ color: '#d7d7d7' }} />
                            </td>
                            <td className={styles.columnAlignLeft}>Name</td>
                            <td className={styles.columnAlignLeft}>Type</td>
                        </tr>
                    </thead>
                    <tbody>
                        {dailyItems}
                    </tbody>
                </Table>
            </div>
        )
    }

}

export default PatientDialiesList;