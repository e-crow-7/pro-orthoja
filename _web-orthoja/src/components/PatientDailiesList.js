import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import styles from './PatientDailiesList.scss';

class PatientDialiesList extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
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

        this.state = {
            selectedItems: []
        }

        // Method bindings
        this.itemElement = this.itemElement.bind(this);
        this.dailyClick = this.dailyClick.bind(this);
        this.dailySelect = this.dailySelect.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.callOnSelected = this.callOnSelected.bind(this);
    }

    componentWillUpdate(nextProps) {
        if(this.props.dailies.length !== nextProps.dailies.length) {
            this.setState({
                selectedItems: nextProps.dailies.map(() => (false))
            }, this.callOnSelected)
        }
    }

    callOnSelected() {

        const dailies = [];

        this.props.dailies.forEach((daily, index) => {
            if(this.state.selectedItems[index]) {
                dailies.push(daily);
            }
        });

        this.props.onSelectItem(dailies);
    }

    selectAll() {
        this.setState({
            selectedItems: this.props.dailies.map(() => (true))
        }, this.callOnSelected);
    }

    dailySelect(index) {
        this.setState((prevState) => {
            const newState = {...prevState};
            newState.selectedItems[index] = !newState.selectedItems[index];
            return(newState);
        });
    }

    dailyClick(index) {
        const daily = this.props.dailies[index];
        this.props.onDailyClick(daily);
    }

    translateName(name) {
        var translation = name;
        const regex = /\[(.*?)\]/g;
        const matches = [];
        var match;
        while(match = regex.exec(name)) {
            translation = translation.replace(match[0], this.props.translator('daily.'+match[1]));
        }
        return translation;
    }

    itemElement({ daily, index, ...props }) {
        return (
            <tr className={this.state.selectedItems[index] ? styles.rowSelected : null}>
                <td
                    onClick={()=>{this.dailySelect(index)}}
                >
                    {this.state.selectedItems[index] ?
                        <FontAwesome name="check-circle" style={{ color: '#d7d7d7' }} /> :
                        <FontAwesome name="circle" style={{ color: '#d7d7d7' }} />
                    }
                </td>
                <td 
                    className={styles.columnAlignLeft + ' ' + styles.columnClickable}
                    onClick={()=>{this.dailyClick(index)}}
                >
                    {this.translateName(daily.name)}
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
                <this.itemElement daily={daily} index={index} key={index} />
            );
        });

        return (
            <div>
                <Table striped bordered condensed hover className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <td style={{ width: '28px' }} /*onClick={this.selectAll}*/>
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