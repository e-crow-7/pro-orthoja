import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Col, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import styles from './NewInputForm.scss';

class NewInputForm extends Component {

    static propTypes = {
        translator: PropTypes.func.isRequired,
        onStateChange: PropTypes.func
    }

    static defaultProps = {
        onStateChange: () => {}
    }

    constructor(props) {
        super(props);

        this.state = {
            type: '',
            name: '',
            position: '',
            unit: '',
            increment: '',
            max: '',
            min: '',
            default: ''
        }

        // Method bindings.
        this.AdditionalFieldsElement = this.AdditionalFieldsElement.bind(this);
    }

    setState(updater) {
        super.setState(updater, () => {
            this.props.onStateChange(this.state);
        });
    }

    FieldElement({ id, label, ...props }) {
        return (
            <FormGroup controlId={id}>
                <Col xm={2} sm={2} componentClass={ControlLabel}>
                    <ControlLabel>{label}:</ControlLabel>
                </Col>
                <Col xm={10} sm={10}>
                    <FormControl {...props} />
                </Col>
            </FormGroup>
        );
    }

    FieldSelectElement({ id, label, options, ...props }) {
        return (
            <FormGroup controlId={id}>
                <Col xm={2} sm={2} componentClass={ControlLabel}>
                    <ControlLabel>{label}:</ControlLabel>
                </Col>
                <Col xm={10} sm={10}>
                    <FormControl {...{...props, componentClass: 'select', type: 'select'}}>
                        {options.map((option, index) => {
                            return (<option value={option.value} key={index}>{option.label}</option>)
                        })}
                    </FormControl>
                </Col>
            </FormGroup>
        );
    }

    AdditionalFieldsElement({type}) {

        if(!typeDefaults[type]) {
            return false;
        }

        const fieldElements = Object.keys(typeDefaults[type]).map((key, index) => {
            const value = key;
            const setting = typeDefaults[type][key];

            if(setting == null) {
                return false;
            }

            return(
                <this.FieldElement
                    id={"field-" + value}
                    label={this.props.translator('form.new-input.' + value)}
                    type="text"
                    value={this.state[value]}
                    onChange={(event) => {
                        const eventValue = event.target.value;
                        this.setState((prevState) => {
                            const newState = {...prevState};
                            newState[value] = eventValue;
                            return newState;
                        })
                    }}
                    key={index}
                />
            )
        });

        return(
            <div className={styles.additionalCategory}>
                {fieldElements}
            </div>
        )
    }

    render() {
        return (
            <div>
                <Form horizontal>
                    <this.FieldSelectElement
                        id="field-type"
                        label={'Type'}
                        options={typeOptions}
                        value={this.state.type}
                        onChange={(event) => {
                            const value = event.target.value;
                            this.setState((prevState) => {
                                const type = value;
                                var newState = {...prevState, type: type};
                                if(typeDefaults[type] != null) {
                                    newState = {...newState, ...typeDefaults[type]};
                                }
                                return newState;
                            })
                        }}
                    />
                    <this.AdditionalFieldsElement type={this.state.type} />
                </Form>
            </div>
        )
    }

}

const typeOptions = [
    {label: "Select...", value: ""},
    {label: "Strut", value: 'strut'},
    {label: "Pain Scale", value: 'pain'},
    {label: "Pills", value: 'pills'},
    {label: 'Time', value: 'time'}
]

const typeDefaults = {
    "strut": {
        "name": "[strut.default]",
        "position": "",
        "unit": "[unit.length.millimeters]",
        "increment": 0.25,
        "min": -10.0,
        "max": 10.0,
        "default": 0
    },
    "pain": {
        "name": "[pain.default]",
        "position": null,
        "unit": null,
        "increment": 1,
        "min": 0.0,
        "max": 10.0,
        "default": 0
    },
    "pills": {
        "name": "[pills.default]",
        "position": null,
        "unit": "[unit.substance.pills]",
        "increment": 1,
        "min": 0.0,
        "max": 10.0,
        "default": 0
    },
    "time": {
        "name": "[exercise.default]",
        "position": null,
        "unit": "[unit.time.minutes]",
        "increment": 1,
        "min": 0.0,
        "max": 10.0,
        "default": 0
    }
}

export default NewInputForm;