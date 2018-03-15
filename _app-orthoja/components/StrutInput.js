import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import SimpleStepper from "react-native-simple-stepper";

export default class StrutInput extends Component {

    static propTypes = {
        value: PropTypes.number,
        onValueChanged: PropTypes.func,

        unit: PropTypes.string,
        min: PropTypes.number,
        max: PropTypes.number,
        increment: PropTypes.number,
        default: PropTypes.number
    }

    static defaultProps = {
        value: null,
        onValueChanged: () => {},

        unit: 'mm',
        min: -10,
        max: 10,
        increment: 0.25,
        default: 0
    }

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value != null ? this.props.value : this.props.default
        }

        // Method bindings
        this.valueChanged = this.valueChanged.bind(this);
    }

    valueChanged(value) {
        this.setState({
            value: value
        })

        this.props.onValueChanged(value);
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.typeContainer}>
                    <Text style={styles.typeText}>
                        #
                    </Text>
                </View>
                <TextInput
                    style={styles.textInput}
                    keyboardType={'numeric'}
                    spellCheck={false}
                    editable={false}
                    value={this.state.value.toFixed(2) + ' ' + this.props.unit}
                />
                <View style={styles.stepperContainer}>
                    <SimpleStepper
                        minimumValue={this.props.min}
                        maximumValue={this.props.max}
                        valueChanged={this.valueChanged}
                        initialValue={this.state.value}
                        stepValue={this.props.increment}
                        tintColor={'#fff'}
                    />
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeContainer: {
        alignItems: 'center',
        paddingRight: 6
    },
    typeText: {
        color: '#fff',
        fontSize: 18
    },
    textInput: {
        flex: 1,
        alignSelf: 'stretch',
        height: 36,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: '#ffffffaa',
        color: "#222",
        textAlign: 'right',
        fontSize: 16
    },
    stepperContainer: {
        paddingLeft: 6
    }
});