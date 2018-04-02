import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Well, Table } from 'react-bootstrap';

import styles from './PatientsList.scss';

class PatientsList extends Component {

    static propTypes = {
        patients: PropTypes.array,
        emptyText: PropTypes.string
    }

    static defaultProps = {
        patients: [],
        emptyText: 'Nothing here.'
    }

    constructor(props) {
        super(props);

        // Method bindings.
        this.renderEmptyTextElement = this.renderEmptyTextElement.bind(this);
        this.renderPatientItems = this.renderPatientItems.bind(this);
    }

    EmptyTextElement({text, ...props}) {
        return (
            <div className={styles.info}>{text}</div>
        );
    }

    renderEmptyTextElement() {
        if(this.props.patients.length <= 0) {
            return(
                <this.EmptyTextElement text={this.props.emptyText} />
            );
        }
        return false;
    }

    PatientItemElement({username, nickname, startDate, index, ...props}) {
        return (
            <tr>
                <td>{index.toString()}</td>
                <td className={styles.columnAlignLeft}>{username}</td>
                <td className={styles.columnAlignLeft}>{nickname || '-'}</td>
                <td className={styles.columnAlignLeft}>{startDate || '-'}</td>
            </tr>
        );
    }

    renderPatientItems() {
        if(this.props.patients.length > 0) {
            const patientElements = this.props.patients.slice(0).reverse().map((value, index) => {
                const inverseIndex = this.props.patients.length - index;
                return (
                    <this.PatientItemElement username={value.username} key={index} index={inverseIndex} />
                );
            });
            return (
                <Table striped bordered condensed hover className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <td>#</td>
                            <td className={styles.columnAlignLeft}>Username</td>
                            <td className={styles.columnAlignLeft}>Nickname</td>
                            <td className={styles.columnAlignLeft}>Start Date</td>
                        </tr>
                    </thead>
                    <tbody>
                        {patientElements}
                    </tbody>
                </Table>
            );
        }

        return false;
    }

    render() {

        return (
            <Well className={styles.container}>
                { this.renderPatientItems() }
                { this.renderEmptyTextElement() }
            </Well>
        )
    }
}

export default PatientsList;