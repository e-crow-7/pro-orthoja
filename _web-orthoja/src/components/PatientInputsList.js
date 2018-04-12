import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Table } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import styles from './PatientInputsList.scss';

class PatientInputsList extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        inputs: PropTypes.array,
        onSelectItem: PropTypes.func,
        onInputClick: PropTypes.func
    }

    static defaultProps = {
        inputs: [],
        onSelectItem: () => { },
        onInputClick: () => { }
    }

    constructor(props) {
        super(props);

        this.state = {
            selectedItems: []
        }

        // Method bindings
        this.itemElement = this.itemElement.bind(this);
        this.inputClick = this.inputClick.bind(this);
        this.inputSelect = this.inputSelect.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.callOnSelected = this.callOnSelected.bind(this);
    }

    componentWillUpdate(nextProps) {
        if(this.props.inputs.length !== nextProps.inputs.length) {
            this.setState({
                selectedItems: nextProps.inputs.map(() => (false))
            }, this.callOnSelected)
        }
    }

    callOnSelected() {

        const inputs = [];

        this.props.inputs.forEach((input, index) => {
            if(this.state.selectedItems[index]) {
                inputs.push(input);
            }
        });

        this.props.onSelectItem(inputs);
    }

    selectAll() {
        this.setState({
            selectedItems: this.props.inputs.map(() => (true))
        }, this.callOnSelected);
    }

    inputSelect(index) {
        this.setState((prevState) => {
            const newState = {...prevState};
            newState.selectedItems[index] = !newState.selectedItems[index];
            return(newState);
        });
    }

    inputClick(index) {
        const input = this.props.inputs[index];
        this.props.onInputClick(input);
    }

    translateName(name) {
        var translation = name;
        const regex = /\[(.*?)\]/g;
        const matches = [];
        var match;
        while(match = regex.exec(name)) {
            translation = translation.replace(match[0], this.props.translator('input.'+match[1]));
        }
        return translation;
    }

    itemElement({ input, index, ...props }) {
        return (
            <tr className={this.state.selectedItems[index] ? styles.rowSelected : null}>
                <td
                    onClick={()=>{this.inputSelect(index)}}
                >
                    {this.state.selectedItems[index] ?
                        <FontAwesome name="check-circle" style={{ color: '#d7d7d7' }} /> :
                        <FontAwesome name="circle" style={{ color: '#d7d7d7' }} />
                    }
                </td>
                <td 
                    className={styles.columnAlignLeft + ' ' + styles.columnClickable}
                    onClick={()=>{this.inputClick(index)}}
                >
                    {this.translateName(input.name)}
                </td>
                <td className={styles.columnAlignLeft}>
                    {input.type}
                </td>
            </tr>
        );
    }

    render() {

        const inputItems = this.props.inputs.map((input, index) => {
            return (
                <this.itemElement input={input} index={index} key={index} />
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
                        {inputItems}
                    </tbody>
                </Table>
            </div>
        )
    }

}

export default PatientInputsList;