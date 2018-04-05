import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';
import { Well, Table, Checkbox } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import styles from './PatientsList.scss';

class PatientsList extends Component {

    static propTypes = {
        patients: PropTypes.array,
        emptyText: PropTypes.string,
        onSelectItem: PropTypes.func,
        onPatientClick: PropTypes.func
    }

    static defaultProps = {
        patients: [],
        emptyText: 'Nothing here.',
        onSelectItem: () => {},
        onPatientClick: () => {}
    }

    constructor(props) {
        super(props);

        this.state = {
            selectedItems: {},
            selectedAll: false
        }

        // Method bindings.
        this.renderEmptyTextElement = this.renderEmptyTextElement.bind(this);
        this.renderPatientItems = this.renderPatientItems.bind(this);
        this.clickedItem = this.clickedItem.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.onSelectItemsFormatting = this.onSelectItemsFormatting.bind(this);
    }

    componentWillUpdate(nextProps) {
        Object.keys(this.state.selectedItems).forEach((key) => {
            if (!nextProps.patients[key]) {
                this.setState((prevState) => {
                    const newState = {...prevState};
                    delete newState.selectedItems[key];
                    return newState;
                });
            }
        });
    }

    EmptyTextElement({ text, ...props }) {
        return (
            <div className={styles.info}>{text}</div>
        );
    }

    renderEmptyTextElement() {
        if (this.props.patients.length <= 0) {
            return (
                <this.EmptyTextElement text={this.props.emptyText} />
            );
        }
        return false;
    }

    clickedItem(index) {
        this.props.onPatientClick(this.props.patients[index]);
    }

    selectedItem(index) {
        if (this.state.selectedItems[index]) {
            this.setState((prevState) => {
                const newState = { ...prevState };
                delete newState.selectedItems[index];
                newState.selectedAll = false;
                this.onSelectItemsFormatting(newState.selectedItems);
                return newState;
            });
        } else {
            this.setState((prevState) => {
                const newState = { ...prevState };
                newState.selectedItems[index] = true;
                if (Object.keys(newState.selectedItems).length == this.props.patients.length) {
                    newState.selectedAll = true;
                }
                this.onSelectItemsFormatting(newState.selectedItems);
                return newState;
            });
        }
    }

    selectAll() {
        const count = this.props.patients.length;
        if (this.state.selectedAll) {
            this.setState((prevState) => {
                const newState = { ...prevState };
                newState.selectedItems = {};
                newState.selectedAll = false;
                this.onSelectItemsFormatting(newState.selectedItems);
                return newState;
            });
        } else {
            this.setState((prevState) => {
                const newState = { ...prevState };
                for (var i = 0; i < count; i++) {
                    newState.selectedItems[i] = true;
                }
                newState.selectedAll = true;
                this.onSelectItemsFormatting(newState.selectedItems);
                return newState;
            });
        }
    }

    onSelectItemsFormatting(selectedIndexObject) {
        const list = Object.keys(selectedIndexObject).map((key) => {
            return this.props.patients[key];
        })
        this.props.onSelectItem(list);
    }

    PatientItemElement({ data, index, onClick, onSelect, selected, ...props }) {
        return (
            <tr className={selected ? styles.rowSelected : null}>
                <td onClick={() => { onSelect(index); }}>
                    {selected ?
                        <FontAwesome name="check-circle" style={{ color: '#d7d7d7' }} /> :
                        <FontAwesome name="circle" style={{ color: '#d7d7d7' }} />
                    }
                </td>
                <td
                    className={styles.columnAlignLeft + ' ' + styles.columnClickable}
                    onClick={() => { onClick(index); }}
                >
                    {data.username}
                </td>
                <td className={styles.columnAlignLeft}>{data.nickname || '-'}</td>
                <td className={styles.columnAlignLeft}>{data.startDate || '-'}</td>
                <td>{
                    data.active ?
                        <FontAwesome name="check" style={{ color: '#00ff66' }} /> :
                        false
                }</td>
            </tr>
        );
    }

    renderPatientItems() {
        if (this.props.patients.length > 0) {
            const patientElements = this.props.patients.slice(0).reverse().map((value, index) => {
                const inverseIndex = this.props.patients.length - index - 1;
                return (
                    <this.PatientItemElement
                        data={value}
                        key={index}
                        index={inverseIndex}
                        onClick={this.clickedItem}
                        onSelect={this.selectedItem}
                        selected={this.state.selectedItems[inverseIndex] ? true : false}
                    />
                );
            });
            return (
                <Table striped bordered condensed hover className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <td style={{ width: '28px' }} onClick={this.selectAll}>
                                {this.state.selectedAll ?
                                    <FontAwesome name="check-circle" style={{ color: '#d7d7d7' }} /> :
                                    <FontAwesome name="circle" style={{ color: '#d7d7d7' }} />
                                }
                            </td>
                            <td className={styles.columnAlignLeft}>Username</td>
                            <td className={styles.columnAlignLeft}>Nickname</td>
                            <td className={styles.columnAlignLeft}>Start Date</td>
                            <td style={{ width: '50px' }}>Active</td>
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
                {this.renderPatientItems()}
                {this.renderEmptyTextElement()}
            </Well>
        )
    }
}

export default PatientsList;