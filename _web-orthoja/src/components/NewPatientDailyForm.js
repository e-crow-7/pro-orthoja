import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Col, Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import styles from './NewPatientDailyForm.scss';

class NewPatientDailyForm extends Component {

    static propTypes = {
        onStateChange: PropTypes.func
    }

    static defaultProps = {
        onStateChange: () => {}
    }

    constructor(props) {
        super(props);

        this.state = {
            type: '',
            for: '',
            half: '',
            title: ''
        }
    }

    /*componentDidUpdate(prevProps, prevState) {
        if(prevState.type !== this.state.type) {
            onStateChange
        }
    }*/

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

    render() {
        return (
            <div>
                <Form horizontal>
                    <this.FieldSelectElement
                        id="field-title"
                        label={'Type'}
                        options={[
                            {label: 'Select...', value: ""},
                            {label: 'Adjustment', value: 'adjustment'},
                            {label: 'Pain', value: 'pain'},
                            {label: 'Medication', value: 'medication'},
                            {label: 'Exercise', value: 'exercise'}
                        ]}
                        value={this.state.type}
                        onChange={(event) => {
                            this.setState({
                                type: event.target.value,
                                for: "",
                                half: ""
                            })
                        }}
                    />
                    {typeFors[this.state.type] ?
                        <this.FieldSelectElement
                            id="field-for"
                            label={'For'}
                            options={typeFors[this.state.type]}
                            value={this.state.for || ""}
                            onChange={(event) => {
                                this.setState({
                                    for: event.target.value,
                                    half: ""
                                })
                            }}
                        />
                        : false
                    }
                    {sagittalHalves[this.state.for] ?
                        <this.FieldSelectElement
                            id="field-half"
                            label={'Half'}
                            options={sagittalHalves[this.state.for]}
                            value={this.state.half || ''}
                            onChange={(event) => {
                                this.setState({
                                    half: event.target.value
                                })
                            }}
                        />
                        : false
                    }
                </Form>
            </div>
        )
    }

}

const typeFors = {
    "adjustment": [
        {label: "Select...", value: ""},
        {label: "Tibia & Fibia", value: "tibia-fibia"},
        {label: "Femur", value: "femur"},
        {label: "Radius & Ulna", value: "radius-ulna"},
        {label: "Humerus", value: "humerus"},
    ]
}

const sagittalHalves = {
    "tibia-fibia": [
        {label: "Select...", value: ""},
        {label: "Left", value: "left"},
        {label: "Right", value: "right"}
    ],
    "femur": [
        {label: "Select...", value: ""},
        {label: "Left", value: "left"},
        {label: "Right", value: "right"}
    ],
    "radius-ulna": [
        {label: "Select...", value: ""},
        {label: "Left", value: "left"},
        {label: "Right", value: "right"}
    ],
    "humerus": [
        {label: "Select...", value: ""},
        {label: "Left", value: "left"},
        {label: "Right", value: "right"}
    ],
}

export default NewPatientDailyForm;